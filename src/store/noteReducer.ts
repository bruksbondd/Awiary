import { BaseThunkType, InferActionsTypes } from './index'
import { db } from '../services/firebase'
import { changeFormatDate } from '../helpers/changeFormatDate'

const initialState = {
  allNotes: [] as [],
  allNotesMonth: [] as Array<{}>,
  todayNotes: [] as any,
  loadingNotes: true as boolean,
  lastSnapshot: null as number | null,
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
    case 'AW/NOTE/SET_LAST_NOTES':
    case 'AW/NOTE/FINISH_SCROLL_NOTES':
    case 'AW/NOTE/FETCH_NOTES_MONTHS':
    case 'AW/NOTE/SET_DATE_ITEM':
    case 'AW/NOTE/SET_TYPE_PAGE':
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
  setLastNotes: (lastSnapshot: number) =>
    ({
      type: 'AW/NOTE/SET_LAST_NOTES',
      payload: {
        loadingNotes: false,
        errorNotes: null,
        lastSnapshot,
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
  const lastSnapshot = getState().notes.lastSnapshot as number | null
  const allNotes = getState().notes.allNotes as []
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

  // const next = db.collectionGroup('notes')
  //   .where('uid', '==', userUid)
  //   .where('type', '==', 'note')
  //   .orderBy('id', 'desc')
  //   .startAfter(lastSnapshot)
  //   .limit(10)
  // const nextSnapshot = await next.get()
  if (last && last.data().id) {
    dispatch(actions.setLastNotes(last.data().id))
  } else if (last === undefined) {
    dispatch(actions.finishScroll(false))
  }

  snapshot.docs.forEach((doc) => {
    allNotesArray.push({...doc.data(), key: doc.id})
  })

  if (last && last.data().id) {
    const newArray: any = allNotes.concat(allNotesArray)
    dispatch(actions.getAllNotes(newArray))
  }
}

export const changeTypePage = (typePage: string): ThunkType => async (dispatch) => {
  dispatch(actions.setTypePage(typePage))
  dispatch(actions.getAllNotes([]))
  dispatch(actions.setLastNotes(0))
  dispatch(getAllNotes(typePage))
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

  const messages = await db.doc(`${userUid}/${isDate}/notes/${keyNote}`).get()
  const newObj: any = {...messages.data(), key: messages.id}

  const newArray: any = allNotes.filter((item: { id: string; key: string }) => {
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
    // const newArray: any = allNotes.concat(allNotesArray)
    dispatch(actions.getAllNotes(newArray))
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

// export const getAllNotes = (): ThunkType => async (dispatch, getState) => {
//   const userUid = getState().auth.uid
//   const lastSnapshot = getState().notes.lastSnapshot
//   const allNotes = getState().notes.allNotes
//   const allNotesArray = [] as any
//   const first = db.collectionGroup('notes')
//     .where('uid', '==', userUid)
//     .where('type', '==', 'note')
//     .orderBy('id', 'desc')
//     .limit(10)
//   const snapshot = await first.get()
//   const last = snapshot.docs[snapshot.docs.length - 1]
//   dispatch(actions.setLastNotes(last.data().id));
//   snapshot.docs.forEach((doc) => {
//     allNotesArray.push({...doc.data(), key: doc.id})
//   })
//   console.log('test')
//   if (last && last.data().id) {
//     const newArray: any = allNotes.concat(allNotesArray)
//     dispatch(actions.getAllNotes(newArray))
//   }
// }


type InitialStateType = typeof initialState;
type ActionsType = InferActionsTypes<typeof actions>;
type ThunkType = BaseThunkType<ActionsType>;
