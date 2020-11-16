import {
  FETCH_DATA_FAILURE,
  FETCH_DATA_REQUEST,
  FETCH_DATA_SUCCESS,
  FETCH_TODAY_NUMBER,
} from './actionTypes';
import { getNotesSelectedDay } from './noteReducer';

const initialState = {
  selectedDate: null,
  todayData: [],
  loadingData: true,
  errorData: null,
};

const calendarReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_DATA_REQUEST:
      return {
        ...state,
        todayData: [],
        loadingData: true,
        errorData: null,
      };
    case FETCH_DATA_SUCCESS:
      return {
        ...state,
        todayData: action.payload,
        loadingData: false,
        errorData: null,
      };
    case FETCH_TODAY_NUMBER:
      return {
        ...state,
        selectedDate: action.payload,
      };
    case FETCH_DATA_FAILURE:
      return {
        ...state,
        todayData: [],
        loadingData: false,
        errorData: action.payload,
      };
    default:
      return state;
  }
};
const dataRequested = () => ({ type: FETCH_DATA_REQUEST });

export const setTodayNumber = (day) => {
  return {
    type: 'FETCH_TODAY_NUMBER',
    payload: day,
  };
};

export const fetchToDayData = (day) => async (dispatch, getState) => {
  dispatch(dataRequested());
  dispatch(setTodayNumber(day));
  dispatch(getNotesSelectedDay(day));
};

export default calendarReducer;
