import { auth, db, setupPresence } from '../services/firebase';

import { BaseThunkType, InferActionsTypes } from './index';

const initialState = {
  uid: '' as string,
  email: null as string | null,
  displayName: null as string | null,
  photoUrl: null as string | null,
  loading: true as boolean,
  isAuth: false as boolean,
};

export const authReducer = (state = initialState, action: ActionsType) => {
  switch (action.type) {
    case 'AW/AUTH/SET_USER_DATA':
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
};

const actions = {
  setAuthUserData: (
    uid: string,
    email: string | null,
    displayName: string | null,
    photoUrl: string | null,
    loading: boolean,
    isAuth: boolean
  ) =>
    ({
      type: 'AW/AUTH/SET_USER_DATA',
      payload: {
        uid,
        email,
        displayName,
        photoUrl,
        loading,
        isAuth,
      },
    } as const),
};

export const getAuthUserData = (): ThunkType => async (dispatch) => {
  auth().onAuthStateChanged((user) => {
    if (user) {
      dispatch(
        actions.setAuthUserData(
          user.uid,
          user.email,
          user.displayName,
          user.photoURL,
          false,
          true,
        )
      );

      const userFirebase = {
        displayName: user.displayName,
        photoUrl: user.photoURL,
        uid: user.uid,
      };

      db.collection('users').doc(user.uid).set(userFirebase, { merge: true });

      setupPresence(user);
    } else {
      dispatch(actions.setAuthUserData('', null, null, null, false, false));
    }
  });
}

export const logout = (): ThunkType => async (dispatch) => {
  auth()
    .signOut()
    .then(() => {
      dispatch(actions.setAuthUserData('', null, null, null, false, false));
    })
    .catch((error) => {
      console.log(error);
    });
};

type InitialStateType = typeof initialState;
type ActionsType = InferActionsTypes<typeof actions>;
type ThunkType = BaseThunkType<ActionsType>;
