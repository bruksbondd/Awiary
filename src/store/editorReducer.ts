import { BaseThunkType, InferActionsTypes } from './index';
import { addNewNote, getAllNotes } from './noteReducer'

const initialState = {
  activeEditor: false as boolean,
  selectedType: 'note' as string,
  content: '' as string,
  activeEditorChangeOldContent: false as boolean,
  activeFillEditor: true as boolean,
  activeModal: false as boolean,
  key: '' as string,
};

export const editorReducer = (state = initialState, action: ActionsType) => {
  switch (action.type) {
    case 'AW/EDITOR/ACTIVE_EDITOR':
    case 'AW/EDITOR/CHANGE_TYPE':
    case 'AW/EDITOR/CHANGE_CONTENT':
    case 'AW/EDITOR/CHANGE_CONTENT_OLD':
    case 'AW/EDITOR/ACTIVE_MODAL':
    case 'AW/EDITOR/SET_KEY_MESSAGE':
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
};

const actions = {
  activeEditor: (activeEditor: boolean) =>
    ({
      type: 'AW/EDITOR/ACTIVE_EDITOR',
      payload: {
        activeEditor,
      },
    } as const),
  changeType: (selectedType: string) =>
    ({
      type: 'AW/EDITOR/CHANGE_TYPE',
      payload: {
        selectedType,
      },
    } as const),
  changeContent: (content: string) =>
    ({
      type: 'AW/EDITOR/CHANGE_CONTENT',
      payload: {
        content,
      },
    } as const),
  changeContentOld: (activeEditorChangeOldContent: boolean) =>
    ({
      type: 'AW/EDITOR/CHANGE_CONTENT_OLD',
      payload: {
        activeEditorChangeOldContent,
      },
    } as const),
  toggleEditor: (activeFillEditor: boolean) =>
    ({
      type: 'AW/EDITOR/ACTIVE_EDITOR',
      payload: {
        activeFillEditor,
      },
    } as const),
  toggleModal: (activeModal: boolean) =>
    ({
      type: 'AW/EDITOR/ACTIVE_MODAL',
      payload: {
        activeModal,
      },
    } as const),
  setKey: (key: string) =>
    ({
      type: 'AW/EDITOR/SET_KEY_MESSAGE',
      payload: {
        key,
      },
    } as const),
};

export const activeStateEditor = (state: boolean): ThunkType => async (
  dispatch,
) => {
  dispatch(actions.activeEditor(state));
};

export const changeSelectedType = (selected: string): ThunkType => async (
  dispatch,
) => {
  dispatch(actions.changeType(selected));
};

export const changeEditorContent = (text: string): ThunkType => async (
  dispatch,
) => {
  dispatch(actions.changeContent(text));
};

export const toggleEditorOldContent = (isContent = true): ThunkType => async (
  dispatch,
) => {
  dispatch(actions.changeContentOld(isContent));
  dispatch(actions.activeEditor(false));
};

export const toggleActiveFillEditor = (
  activeFillEditor: boolean,
): ThunkType => async (dispatch) => {
  dispatch(actions.toggleEditor(activeFillEditor));
};

export const toggleActiveModal = (activeModal: boolean): ThunkType => async (
  dispatch,
) => {
  dispatch(actions.toggleModal(activeModal));
};

export const setKey = (key: string): ThunkType => async (dispatch) => {
  dispatch(actions.setKey(key));
  dispatch(actions.changeContentOld(true));
};

export const saveContent = (text: string): ThunkType => async (
  dispatch,
  getState,
) => {
  const typePage = getState().notes.typePage
  if (getState().editor.activeEditorChangeOldContent) {
    dispatch(actions.toggleModal(true));
  } else {
    dispatch(addNewNote(text));
    dispatch(actions.toggleModal(false));
    dispatch(actions.changeContentOld(false));
    dispatch(getAllNotes(typePage))
  }
};

type InitialStateType = typeof initialState;
type ActionsType = InferActionsTypes<typeof actions>;
type ThunkType = BaseThunkType<ActionsType>;
