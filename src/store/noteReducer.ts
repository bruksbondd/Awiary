import { BaseThunkType, InferActionsTypes } from './index'
import { db } from '../services/firebase'
import { changeFormatDate } from '../helpers/changeFormatDate'

const initialState = {
  allNotes: [] as [],
  allAwareness: [] as [],
  allNotesMonth: [] as Array<{}>,
  todayNotes: [] as any,
  loadingNotes: true as boolean,
  lastSnapshotNote: null as number | null,
  lastSnapshotAware: null as number | null,
  runOutOfNotes: true as boolean,
  errorNotes: null as null | string,
  content: '' as string,
  itemDate: '' as string,
  key: null as number | null,
  dataNewDay: null as null | number,
  typePage: 'note' as string,
}

export const notesReducer = (state = initialState, action: ActionsType) => {
  switch (action.type) {
    case 'AW/NOTE/FETCH_NOTES_REQUEST':
    case 'AW/NOTE/FETCH_NOTES_FAILURE':
    case 'AW/NOTE/FETCH_NOTES_DAY':
    case 'AW/NOTE/FETCH_NOTES_ALL':
    case 'AW/NOTE/FETCH_AWARENESS_ALL':
    case 'AW/NOTE/SET_LAST_NOTES':
    case 'AW/NOTE/SET_LAST_AWARENESS':
    case 'AW/NOTE/FINISH_SCROLL_NOTES':
    case 'AW/NOTE/FETCH_NOTES_MONTHS':
    case 'AW/NOTE/SET_DATE_ITEM':
    case 'AW/NOTE/SET_TYPE_PAGE':
    case 'AW/NOTE/LOGOUT_AND_CLEAN':
      return {
        ...state,
        ...action.payload,
      }
    default:
      return state
  }
}

const actions = {
  noteRequested: () =>
    ({
      type: 'AW/NOTE/FETCH_NOTES_REQUEST',
      payload: {
        todayNotes: [],
        loadingNotes: true,
        errorNotes: null,
      },
    } as const),
  noteError: (error: string) =>
    ({
      type: 'AW/NOTE/FETCH_NOTES_FAILURE',
      payload: {
        todayNotes: [],
        loadingNotes: false,
        errorNotes: error,
      },
    } as const),
  getNotesDay: (todayNotes: []) =>
    ({
      type: 'AW/NOTE/FETCH_NOTES_DAY',
      payload: {
        loadingNotes: false,
        errorNotes: null,
        todayNotes,
      },
    } as const),
  getAllNotesMonth: (allNotesMonth: []) =>
    ({
      type: 'AW/NOTE/FETCH_NOTES_MONTHS',
      payload: {
        loadingNotes: false,
        errorNotes: null,
        allNotesMonth,
      },
    } as const),
  getAllNotes: (allNotes: []) =>
    ({
      type: 'AW/NOTE/FETCH_NOTES_ALL',
      payload: {
        loadingNotes: false,
        errorNotes: null,
        allNotes,
      },
    } as const),
  getAllAwareness: (allAwareness: []) =>
  ({
    type: 'AW/NOTE/FETCH_AWARENESS_ALL',
    payload: {
      loadingNotes: false,
      errorNotes: null,
      allAwareness,
    },
  } as const),
  setLastNotes: (lastSnapshotNote: number | null) =>
    ({
      type: 'AW/NOTE/SET_LAST_NOTES',
      payload: {
        loadingNotes: false,
        errorNotes: null,
        lastSnapshotNote,
      },
    } as const),
  setLastAwareness: (lastSnapshotAware: number | null) =>
    ({
      type: 'AW/NOTE/SET_LAST_AWARENESS',
      payload: {
        loadingNotes: false,
        errorNotes: null,
        lastSnapshotAware,
      },
    } as const),
  finishScroll: (runOutOfNotes: boolean) =>
    ({
      type: 'AW/NOTE/FINISH_SCROLL_NOTES',
      payload: {
        loadingNotes: false,
        errorNotes: null,
        runOutOfNotes,
      },
    } as const),
  getDateNewDay: (dataNewDay: number) =>
    ({
      type: 'AW/NOTE/GET_DATE_NEW_DAY',
      payload: {
        dataNewDay,
      },
    } as const),
  setDateItem: (itemDate: string) =>
    ({
      type: 'AW/NOTE/SET_DATE_ITEM',
      payload: {
        itemDate,
      },
    } as const),
  setTypePage: (typePage: string) =>
    ({
      type: 'AW/NOTE/SET_TYPE_PAGE',
      payload: {
        typePage,
      },
    } as const),
  logoutAndClean: () =>
    ({
      type: 'AW/NOTE/LOGOUT_AND_CLEAN',
      payload: {
        allNotes: [] as [],
        allAwareness: [] as [],
        allNotesMonth: [] as Array<{}>,
        todayNotes: [] as any,
        loadingNotes: true as boolean,
        lastSnapshotNote: null as number | null,
        lastSnapshotAware: null as number | null,
        runOutOfNotes: true as boolean,
        errorNotes: null as null | string,
        content: '' as string,
        itemDate: '' as string,
        key: null as number | null,
        dataNewDay: null as null | number,
        typePage: 'note' as string,
      },
    } as const),
}

export const changeItemDate = (itemDate: string): ThunkType => async (dispatch) => {
  dispatch(actions.setDateItem(itemDate))
}

export const getNotesSelectedDay = (): ThunkType => async (
  dispatch,
  getState
) => {
  const selectedDate = changeFormatDate(getState().calendar.selectedDate, '')
  const userUid = getState().auth.uid
  try {
    const notesArray = [] as any
    const allMessages = db.collection(`${userUid}/${selectedDate}/notes`)
    const allMessagesToday = await allMessages.get()
    for (const doc of allMessagesToday.docs) {
      notesArray.push({...doc.data(), key: doc.id})
    }

    notesArray.sort((a: { id: number }, b: { id: number }) => a.id - b.id)
    dispatch(actions.getNotesDay(notesArray))
  } catch (error) {
    dispatch(actions.noteError(error))
  }
}

export const getAllNotes = (path: string): ThunkType => async (dispatch, getState) => {
  const userUid = getState().auth.uid
  const lastSnapshotNote = getState().notes.lastSnapshotNote as number | null
  const lastSnapshotAware = getState().notes.lastSnapshotAware as number | null
  let lastSnapshot = path === 'note' ? lastSnapshotNote : lastSnapshotAware
  const allNotes = getState().notes.allNotes as []
  const allAware = getState().notes.allAwareness as []
  let all = path === 'note' ? allNotes : allAware
  const allNotesArray = [] as any

  let first = db.collectionGroup('notes')
    .where('uid', '==', userUid)
    .where('type', '==', path)
    .orderBy('id', 'desc')
    .limit(10)
  if (lastSnapshot) {
    first = first.startAfter(lastSnapshot)
  }
  const snapshot = await first.get()
  const last = snapshot.docs[snapshot.docs.length - 1]

  snapshot.docs.forEach((doc) => {
    allNotesArray.push({...doc.data(), key: doc.id})
  })

  if (last && last.data().id) {
    const newArray: any = all.concat(allNotesArray)
    path === 'note' ? dispatch(actions.getAllNotes(newArray)) : dispatch(actions.getAllAwareness(newArray))
    path === 'note' ? dispatch(actions.setLastNotes(last.data().id)) : dispatch(actions.setLastAwareness(last.data().id))
  }

  if (snapshot && last === undefined) {
    dispatch(actions.finishScroll(false))
  }
}

export const changeTypePage = (typePage: string): ThunkType => async (dispatch) => {
  dispatch(actions.setTypePage(typePage))
  // dispatch(actions.getAllNotes([]))

  dispatch(getAllNotes(typePage))
  // dispatch(actions.setLastNotes(null))
  dispatch(actions.finishScroll(true))
}

export const updateAllNotes = (keyNote: string | undefined = ''): ThunkType => async (
  dispatch,
  getState,
) => {
  const selectedDate = changeFormatDate(getState().calendar.selectedDate, '')
  const itemData = getState().notes.itemDate as string | ''
  const isDate = itemData ? itemData : selectedDate
  const userUid = getState().auth.uid
  const allNotes = getState().notes.allNotes as []
  const allAwareness = getState().notes.allAwareness as []

  const messages = await db.doc(`${userUid}/${isDate}/notes/${keyNote}`).get()
  const newObj: any = {...messages.data(), key: messages.id}
  let all = newObj.type === 'note' ? allNotes : allAwareness
  const newArray: any = all.filter((item: { id: string; key: string }) => {
    if (messages.data() === undefined && item.key === newObj.key) {
      return false
    }
    return item
  }).map((item: { id: string }) => {
    if (item.id === newObj.id) {
      return newObj
    }
    return item
  })
  if (keyNote) {
    newObj.type === 'note' ? dispatch(actions.getAllNotes(newArray)) : dispatch(actions.getAllAwareness(newArray))
  }
}

export const addNewNote = (content: string): ThunkType => async (
  dispatch,
  getState
) => {
  const userUid = getState().auth.uid
  const selectType = getState().editor.selectedType
  const typePage = getState().notes.typePage
  const todayDate = changeFormatDate(new Date(), '')

  try {
    await db.collection(`${userUid}/${todayDate}/notes`).add({
      createdAt: new Date(),
      type: selectType,
      date: todayDate,
      content,
      id: Date.now(),
      uid: userUid,
    })
    dispatch(getNotesSelectedDay())
    dispatch(actions.getAllNotes([]))
    dispatch(actions.setLastNotes(0))
    dispatch(getAllNotes(typePage))
  } catch (error) {
    dispatch(actions.noteError(error))
  }
}

export const updateNote = (
  newContent: string,
  keyNote: string,
): ThunkType => async (dispatch, getState) => {
  const userUid = getState().auth.uid
  const itemData = getState().notes.itemDate as string

  try {
    await db
      .doc(`${userUid}/${itemData}/notes/${keyNote}`)
      .update({
        content: newContent,
      })
      .then(() => {
        dispatch(getNotesSelectedDay())
        dispatch(updateAllNotes(keyNote))
      })
  } catch (error) {
    dispatch(actions.noteError(error))
  }
}

export const deleteNote = (key: string, type: string, date: string): ThunkType => async (
  dispatch,
  getState
) => {

  const userUid = getState().auth.uid
  try {
    await db.doc(`${userUid}/${date}/notes/${key}`).delete()
    dispatch(getNotesSelectedDay())
    dispatch(updateAllNotes(key))
  } catch (error) {
    dispatch(actions.noteError(error))
  }
}

export const getAllNotesMonth = (): ThunkType => async (dispatch, getState) => {
  const userUid = getState().auth.uid
  const arrDate: string[] = []
  try {
    const allDay = await db.collection(userUid).get()
    allDay.forEach((doc) => {
      arrDate.push(doc.id)
    })
  } catch (e) {
    console.log(e)
  }

  try {
    const notesArray = [] as any
    for (let i = 0; i < arrDate.length; i++) {
      const allNotes = await db
        .collection(`${userUid}/${arrDate[i]}/notes`)
        .get()
      for (const doc of allNotes.docs) {
        notesArray.push({...doc.data(), key: doc.id})
      }
    }
    dispatch(actions.getAllNotesMonth(notesArray))
  } catch (e) {
    console.log(e)
  }
}

export const resetNotes = (): ThunkType => async (dispatch) => {
  dispatch(actions.logoutAndClean())
}

type ActionsType = InferActionsTypes<typeof actions>;
type ThunkType = BaseThunkType<ActionsType>;
