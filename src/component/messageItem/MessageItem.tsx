import ReactHtmlParser from 'react-html-parser'
import EditIcon from '@material-ui/icons/Edit'
import DeleteIcon from '@material-ui/icons/Delete'
import React, {
  FC, useCallback,
} from 'react'
import { useDispatch } from 'react-redux'
import styles from '../messages/messages.module.css'
import {
  activeStateEditor,
  changeEditorContent,
  changeSelectedType,
  setKey,
  toggleActiveFillEditor,
} from '../../store/editorReducer'
import { deleteNote, changeItemDate } from '../../store/noteReducer'
import { shouldShowDay } from '../../helpers/shouldShowDay'
import { changeFormatDate } from '../../helpers/changeFormatDate'

export type PropsMessageItem = {
  note: {
    id: number;
    key: string;
    type: string;
    content: string;
    date: string;
    createdAt?: {seconds: number};
  };
  previous?: {createdAt: {seconds: number}; date: string};
  isAll?: boolean | undefined;
}

export const MessageItem: FC<PropsMessageItem> = ({ note, previous, isAll }: PropsMessageItem) => {
  const dispatch = useDispatch()
  const date = new Date()
  date.setTime(note.id)

  const showDay = shouldShowDay(previous, note)
  const showDate = changeFormatDate(new Date(note.id), '/')

  const editorContent = useCallback(
    (text, key, type, itemDate) => {
      dispatch(changeSelectedType(type))
      dispatch(changeItemDate(itemDate))
      dispatch(activeStateEditor(true))
      dispatch(toggleActiveFillEditor(false))
      dispatch(changeEditorContent(text))
      dispatch(setKey(key))
    },
    [dispatch],
  )
  const removeContent = useCallback(
    async (key, type, dateItem) => {
      console.log('removeContent')
      dispatch(deleteNote(key, type, dateItem))
    },
    [dispatch],
  )

  return (
    <>

      <div className={styles.message_item}>
        <div
          className={`${styles.message_item_box} ${
            note.type === 'note' ? styles.class_note : styles.class_awareness
          }`}
        >
          <span className={styles.message_time}>
            {(date.getHours() === 0 ? '0' : '') + date.getHours() }
            :
            { (date.getMinutes() < 10 ? '0' : '') + date.getMinutes()}
          </span>

          <article className={`${styles.message_text}`}>
            {ReactHtmlParser(note.content)}
          </article>

        </div>
        <div className={styles.message_remote}>
          <EditIcon
            className={styles.message_editor}
            onClick={() => editorContent(note.content, note.key, note.type, note.date)}
          />

          <DeleteIcon
            className={styles.message_remove}
            onClick={() => removeContent(note.key, note.type, note.date)}
          />
        </div>
      </div>
      <div className={styles.date_item}>{ isAll && showDay && showDate }</div>
    </>
  )
}
