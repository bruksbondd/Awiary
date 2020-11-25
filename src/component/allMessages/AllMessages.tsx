import React, { FC, MutableRefObject, useEffect, useRef, useState } from 'react'
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
import { Spinner } from '../spinner/Spinner'


export const AllMessages: FC = (props) => {
  const [elHeight, setElHeight] = useState<boolean>(true)

  const activeFillEditor = useShallowEqualSelector(
    (state: AppStateType) => state.editor.activeFillEditor,
  )
  const allNotes = useShallowEqualSelector(
    (state: AppStateType) => state.notes.allNotes,
  )
  const allAwareness = useShallowEqualSelector(
    (state: AppStateType) => state.notes.allAwareness,
  )
  const runOutOfNotes = useShallowEqualSelector(
    (state: AppStateType) => state.notes.runOutOfNotes,
  )

  const overlayEl = useRef() as MutableRefObject<HTMLDivElement>;
  const childrenOverlayEl = useRef() as MutableRefObject<HTMLDivElement>;
  const inverse = true
  const isAll = true
  const dispatch = useDispatch()
  const useHistory = useLocation();
  const pathWithSlash = useHistory.pathname.substring(1)
  let allItems = pathWithSlash === 'note' ? allNotes : allAwareness


  useEffect(() => {
    dispatch(getNotesSelectedDay())
    dispatch(fetchToDayThanks())
    dispatch(getAllNotes(pathWithSlash))
  }, [dispatch, pathWithSlash])

  useEffect(() => {
    setElHeight(overlayEl.current.clientHeight > childrenOverlayEl.current.clientHeight)
  }, [allNotes, allAwareness, overlayEl, childrenOverlayEl])

  return (
    <div
      ref={overlayEl}
      className={`${styles.messages_area} 
      ${!activeFillEditor ? styles.messages_area_active_editor : ''} 
      ${elHeight ? styles.column : styles.column_reverse}
      `}
      id="scrollableDiv"
      style={{
        overflow: 'auto',
        display: 'flex',
        // flexDirection: 'column-reverse',
      }}
    >
      <div

        ref={childrenOverlayEl}

      >
      <InfiniteScroll
        dataLength={allItems.length}
        next={() => dispatch(getAllNotes(pathWithSlash))}
        style={{ display: 'flex', flexDirection: 'column-reverse' }}
        inverse={inverse}
        hasMore={runOutOfNotes}
        loader={<h4><Spinner/></h4>}
        scrollableTarget="scrollableDiv"
      >

      { allItems && allItems.map(
        (note:
           {
             id: number;
             type: string;
             content: string;
             key: string;
             date: string;
             createdAt: {seconds: number}
           }, index) => {
          const previous = allItems[index + 1]
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
    </div>
  )
}
