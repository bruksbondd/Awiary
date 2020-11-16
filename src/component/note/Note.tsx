import React from 'react';
import { SuccessEditModal } from '../modal/Modal';
import Editor from '../editor/Editor';
import { Messages } from '../messages/Messages';
import { EditorPanel } from '../editorPanel/EditorPanel';
import useShallowEqualSelector from '../../hooks/useShallowEqualSelector';
import { changeFormatDate } from '../../helpers/changeFormatDate';
import styles from './note.module.css';

export const Note = () => {
  const selectedDate = useShallowEqualSelector((state) =>
    changeFormatDate(state.calendar.selectedDate, ''));
  const today = changeFormatDate(new Date(), '');
  const activeEditor = useShallowEqualSelector(
    (state) => state.editor.activeEditor
  );

  if (today === selectedDate || activeEditor) {
    return (
      <>
        <SuccessEditModal />
        <Messages />
        <div className={styles.editor}>
          <EditorPanel />
          <Editor />
        </div>
      </>
    );
  }

  return (
    <>
      <SuccessEditModal />
      <Messages />
    </>
  );
};
