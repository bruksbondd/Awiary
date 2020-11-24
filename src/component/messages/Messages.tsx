import React from 'react'

import useShallowEqualSelector from '../../hooks/useShallowEqualSelector'
import { MessageItem } from '../messageItem/MessageItem'
import styles from './messages.module.css'

export const Messages = () => {
  const content = useShallowEqualSelector((state) => state.notes.todayNotes)
  const activeFillEditor = useShallowEqualSelector(
    (state) => state.editor.activeFillEditor)

  return (
    <div className={`${styles.messages_area} ${!activeFillEditor
      ? styles.messages_area_active_editor
      : ''} `}
    >
      {content.map((note: {
        id: number;
        type: string;
        content: string;
        key: string;
        date: string;
      }) => {
        return (
          <MessageItem
            key={note.id}
            note={note}
          />
        )
      })}
    </div>
  )
}
