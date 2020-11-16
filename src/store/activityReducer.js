import { db, firebase } from '../services/firebase';

import {
  changeFormatDate,
} from '../helpers/changeFormatDate';

// const d = new Date();
// const time = `${d.getDate()}${(d.getMonth()+1)}${d.getFullYear()}`;

const initialState = {
  allActivity: [],
  loadingActivity: true,
  errorActivity: null,
  todayActivity: [],
};

const activityReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'FETCH_ACTIVITY_REQUEST':
      return {
        ...state,
        todayActivity: [],
        loadingActivity: true,
        errorActivity: null,
      };
    case 'FETCH_ACTIVITY_TODAY_SUCCESS':
      return {
        ...state,
        todayActivity: action.payload,
        loadingActivity: false,
        errorActivity: null,
      };
    case 'FETCH_ACTIVITY_SUCCESS':
      return {
        ...state,
        allActivity: action.payload,
        loadingActivity: false,
        errorActivity: null,
      };
    case 'FETCH_ACTIVITY_FAILURE':
      return {
        ...state,
        todayActivity: [],
        loadingActivity: false,
        errorActivity: action.payload,
      };
    default:
      return state;
  }
};

const activityRequested = () => {
  return {
    type: 'FETCH_ACTIVITY_REQUEST',
  };
};

const activityTodayLoaded = (array) => {
  return {
    type: 'FETCH_ACTIVITY_TODAY_SUCCESS',
    payload: array,
  };
};

const activityAllLoaded = (activity) => {
  return {
    type: 'FETCH_ACTIVITY_SUCCESS',
    payload: activity,
  };
};

const activityError = (error) => {
  return {
    type: 'FETCH_ACTIVITY_FAILURE',
    payload: error,
  };
};

export const fetchActivity = () => (dispatch, getState) => {
  // dispatch(activityRequested());
  const userUid = getState().auth.uid;

  try {
    db.collection(userUid).onSnapshot((querySnapshot) => {
      const activity = [];
      querySnapshot.forEach((doc) => {
        activity.push({ [doc.id]: doc.data() });
      });
      dispatch(activityAllLoaded(activity));
    });
  } catch (error) {
    dispatch(activityError(error));
  }
};

export const fetchToDayActivity = () => (dispatch, getState) => {
  const selectedDate = changeFormatDate(getState().calendar.selectedDate, '');
  const userUid = getState().auth.uid;
  dispatch(activityRequested());

  try {
    db.collection(userUid)
      .doc(selectedDate)
      .onSnapshot((doc) => {
        if (doc.data()) {
          dispatch(activityTodayLoaded(doc.data().activity));
        }
      });
  } catch (error) {
    dispatch(activityError(error));
  }
};

export const addActivity = (name) => async (dispatch, getState) => {
  const selectedDate = changeFormatDate(getState().calendar.selectedDate, '');
  const isTodayActivity = getState().activity.todayActivity;
  const today = changeFormatDate(new Date(), '');
  const userUid = getState().auth.uid;

  if (today !== selectedDate) {
    return;
  }

  const activityRef = db.collection(userUid).doc(selectedDate);

  try {
    if (isTodayActivity.length) {
      await activityRef.update({
        activity: firebase.firestore.FieldValue.arrayUnion(name),
      });
    } else {
      await activityRef.set({
        activity: firebase.firestore.FieldValue.arrayUnion(name),
      });
    }
  } catch (error) {
    dispatch(activityError(error));
  }
};

export const removeActivity = (name) => async (dispatch, getState) => {
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
    dispatch(activityError(error));
  }
};

export default activityReducer;
