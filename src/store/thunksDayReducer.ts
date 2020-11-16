import { BaseThunkType, InferActionsTypes } from './index';
import { changeFormatDate } from '../helpers/changeFormatDate';
import { db } from '../services/firebase';

const initialState = {
  thunk: '',
  thought: '',
  errorThanks: '' as string,
};

export const thunksDayReducer = (state = initialState, action: ActionsType) => {
  switch (action.type) {
    case 'AW/NOTE/FETCH_THANKS_DAY':
    case 'AW/NOTE/FETCH_THANKS_FAILURE':
    case 'AW/NOTE/REQUEST_THANKS':
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
};

const actions = {
  thunksError: (error: string) =>
    ({
      type: 'AW/NOTE/FETCH_THANKS_FAILURE',
      payload: {
        errorThanks: error,
      },
    } as const),
  getThunksToday: (thunk: string, thought: string) =>
    ({
      type: 'AW/NOTE/FETCH_THANKS_DAY',
      payload: {
        thunk,
        thought,
        errorThanks: '',
      },
    } as const),
  requestThoughtToday: () =>
    ({
      type: 'AW/NOTE/REQUEST_THANKS',
      payload: {
        thunk: '',
        thought: '',
        errorThanks: '',
      },
    } as const),
};

export const requestDataThanks = (): ThunkType => async (dispatch) => {
  dispatch(actions.requestThoughtToday())
}

export const fetchToDayThanks = (): ThunkType => async (dispatch, getState) => {

  const selectedDate = changeFormatDate(getState().calendar.selectedDate, '');
  const userUid = getState().auth.uid;
  try {
    // const thunk = await db
    //   .doc(`${userUid}/${selectedDate}/thunks/thunks`)
    //   .get();
    // const thought = await db
    //   .doc(`${userUid}/${selectedDate}/thunks/thought`)
    //   .get();

    const arrThunk = await db
      .collection(`${userUid}/${selectedDate}/thunks/`)
      .get();

    let thunks: any = ''
    let thought: any = ''
    arrThunk.forEach((doc) => {
      if (doc.id === 'thunks') {
        if (doc.data().content) {
          thunks = doc.data().content
        } else {
          thunks = ''
        }
      }

      if (doc.id === 'thought') {
        if (doc.data().content) {
          thought = doc.data().content
        } else {
          thought = ''
        }
      }
    })

    dispatch(actions.getThunksToday(thunks, thought));
  } catch (error) {
    dispatch(actions.thunksError(error));
  }
};

export const addThanks = (content: string, type: string): ThunkType => async (
  dispatch,
  getState
) => {
  const selectedDate = changeFormatDate(getState().calendar.selectedDate, '');
  const today = changeFormatDate(new Date(), '');
  const userUid: string = getState().auth.uid;

  if (today !== selectedDate) {
    return;
  }

  const thunksRef = db
    .collection(userUid)
    .doc(selectedDate)
    .collection('thunks')
    .doc(type);

  try {
    await thunksRef.set({
      content,
    });
  } catch (error) {
    dispatch(actions.thunksError(error));
  }
  dispatch(fetchToDayThanks());
};

type InitialStateType = typeof initialState;
type ActionsType = InferActionsTypes<typeof actions>;
type ThunkType = BaseThunkType<ActionsType>;
