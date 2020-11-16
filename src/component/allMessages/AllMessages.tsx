import React, { FC, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useLocation } from 'react-router-dom'
import InfiniteScroll from 'react-infinite-scroll-component'
import {
  getAllNotes,
  getNotesSelectedDay,
} from '../../store/noteReducer'
import useShallowEqualSelector from '../../hooks/useShallowEqualSelector'
import styles from './allMessages.module.css'
import { AppStateType } from '../../store'
import { fetchToDayThanks } from '../../store/thunksDayReducer'
import { MessageItem } from '../messageItem/MessageItem'


export const AllMessages: FC = () => {

  const activeFillEditor = useShallowEqualSelector(
    (state: AppStateType) => state.editor.activeFillEditor,
  )
  const allNotes = useShallowEqualSelector(
    (state: AppStateType) => state.notes.allNotes,
  )
  const runOutOfNotes = useShallowEqualSelector(
    (state: AppStateType) => state.notes.runOutOfNotes,
  )
  const inverse = true
  const isAll = true
  const dispatch = useDispatch()
  const useHistory = useLocation();
  const pathWithSlash = useHistory.pathname.substring(1)

  useEffect(() => {
    dispatch(getNotesSelectedDay())
    dispatch(fetchToDayThanks())
    dispatch(getAllNotes(pathWithSlash))
  }, [dispatch, pathWithSlash])
  return (
    <div
      className={`${styles.messages_area} ${
        !activeFillEditor ? styles.messages_area_active_editor : ''
      } `}
      id="scrollableDiv"
      style={{
        // height: 300,
        overflow: 'auto',
        display: 'flex',
        flexDirection: 'column-reverse',
      }}
    >
      {/*{loadingNotes ? <div className="spinner-border text-success" role="status">*/}
      {/*  <Spinner/>*/}
      {/*</div> : ""}*/}
      <InfiniteScroll
        dataLength={allNotes.length}
        next={() => dispatch(getAllNotes(pathWithSlash))}
        style={{ display: 'flex', flexDirection: 'column-reverse' }}
        inverse={inverse}
        hasMore={runOutOfNotes}
        loader={<h4>Loading...</h4>}
        scrollableTarget="scrollableDiv"
      >

      { allNotes && allNotes.map(
        // eslint-disable-next-line max-len
        (note: { id: number; type: string; content: string; key: string; date: string; createdAt: {seconds: number} }, index) => {
          const previous = allNotes[index + 1]
          return (
            <MessageItem
              key={note.key}
              note={note}
              previous={previous}
              isAll={isAll}
            />
          )
        },
      )}
      </InfiniteScroll>
    </div>
  )
}
