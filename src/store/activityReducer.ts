import { db, firebase } from '../services/firebase'

import { BaseThunkType, InferActionsTypes } from './index';
import { changeFormatDate } from '../helpers/changeFormatDate'


const initialState = {
  allActivity: [] as [],
  loadingActivity: true,
  errorActivity: null,
  todayActivity: [] as [],
};

export const activeReducer = (state = initialState, action: ActionsType) => {
  switch (action.type) {
    case 'AW/ACTIVITY/FETCH_ACTIVITY_REQUEST':
    case 'AW/ACTIVITY/FETCH_ACTIVITY_TODAY_SUCCESS':
    case 'AW/ACTIVITY/FETCH_ACTIVITY_SUCCESS':
    case 'AW/ACTIVITY/FETCH_ACTIVITY_FAILURE':
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
};

const actions = {
  activityRequested: () =>
    ({
      type: 'AW/ACTIVITY/FETCH_ACTIVITY_REQUEST',
      payload: {
        todayActivity: [],
        loadingActivity: true,
        errorActivity: null,
      },
    } as const),
  activityTodayLoaded: (array: any) =>
    ({
      type: 'AW/ACTIVITY/FETCH_ACTIVITY_TODAY_SUCCESS',
      payload: {
        todayActivity: array,
        loadingActivity: false,
        errorActivity: null,
      },
    } as const),
  activityAllLoaded: (activity: Array<string>) =>
    ({
      type: 'AW/ACTIVITY/FETCH_ACTIVITY_SUCCESS',
      payload: {
        allActivity: activity,
        loadingActivity: false,
        errorActivity: null,
      },
    } as const),
  activityError: (error: string) =>
    ({
      type: 'AW/ACTIVITY/FETCH_ACTIVITY_FAILURE',
      payload: {
        todayActivity: [],
        loadingActivity: false,
        errorActivity: error,
      },
    } as const)
};

export const fetchActivity = (): ThunkType => async (dispatch, getState) => {
  const userUid = getState().auth.uid;
  try {
    db.collection(userUid).onSnapshot((querySnapshot) => {
      const activity: any = [] ;
      querySnapshot.forEach((doc) => {
        activity.push({ [doc.id]: doc.data() });
      });
      dispatch(actions.activityAllLoaded(activity));
    });
  } catch (error) {
    dispatch(actions.activityError(error));
  }
};

export const fetchToDayActivity = (): ThunkType => async (dispatch, getState) => {
  const selectedDate = changeFormatDate(getState().calendar.selectedDate, '');
  const userUid = getState().auth.uid;
  dispatch(actions.activityRequested());

  try {
    db.collection(userUid)
      .doc(selectedDate)
      .onSnapshot(async (querySnapshot ) => {
        const data = await querySnapshot.data()

        if (data) {
          dispatch(actions.activityTodayLoaded(data.activity));
        }
      });
  } catch (error) {
    dispatch(actions.activityError(error));
  }
};

export const addActivity = (name: string): ThunkType => async (dispatch, getState) => {
  const selectedDate = changeFormatDate(getState().calendar.selectedDate, '');
  const isTodayActivity: { todayActivity: [] } = getState().active

  const today = changeFormatDate(new Date(), '');
  const userUid = getState().auth.uid;

  if (today !== selectedDate) {
    return;
  }

  const activityRef = db.collection(userUid).doc(selectedDate);

  try {
    if (isTodayActivity.todayActivity.length) {
      await activityRef.update({
        activity: firebase.firestore.FieldValue.arrayUnion(name),
      });
    } else {
      await activityRef.set({
        activity: firebase.firestore.FieldValue.arrayUnion(name),
      });
    }
  } catch (error) {
    dispatch(actions.activityError(error));
  }
};

export const removeActivity = (name: string): ThunkType => async (dispatch, getState) => {
  const selectedDate = changeFormatDate(getState().calendar.selectedDate, '');
  const today = changeFormatDate(new Date(), '');
  const userUid = getState().auth.uid;

  if (today !== selectedDate) {
    return;
  }

  try {
    await db
      .collection(userUid)
      .doc(selectedDate)
      .update({
        activity: firebase.firestore.FieldValue.arrayRemove(name),
      });
  } catch (error) {
    dispatch(actions.activityError(error));
  }
};

type InitialStateType = typeof initialState;
type ActionsType = InferActionsTypes<typeof actions>;
type ThunkType = BaseThunkType<ActionsType>;