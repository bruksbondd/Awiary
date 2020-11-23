import {
  Action,
  applyMiddleware,
  combineReducers,
  compose,
  createStore,
} from 'redux';
import thunkMiddleware, { ThunkAction } from 'redux-thunk';
import { authReducer } from './authReducer';
import calendarReducer from './calendarReducer';
import { notesReducer } from './noteReducer';
import { editorReducer } from './editorReducer';
import { thunksDayReducer } from './thunksDayReducer';
import { activeReducer } from './activityReducer';

const rootReducer = combineReducers({
  active: activeReducer,
  thunks: thunksDayReducer,
  editor: editorReducer,
  notes: notesReducer,
  calendar: calendarReducer,
  auth: authReducer,
});

type RootReducerType = typeof rootReducer;
export type AppStateType = ReturnType<RootReducerType>;

export type InferActionsTypes<T> = T extends {
  [keys: string]: (...args: any[]) => infer U;
}
  ? U
  : never;

export type BaseThunkType<
  A extends Action = Action,
  R = Promise<void>
> = ThunkAction<R, AppStateType, unknown, A>;

// @ts-ignore
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
export const store = createStore(
  rootReducer,
  composeEnhancers(applyMiddleware(thunkMiddleware)),
);
