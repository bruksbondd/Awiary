import React, { FC, useCallback, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import Button from '@material-ui/core/Button';

import { getNotesSelectedDay } from '../../store/noteReducer';
import { fetchToDayThanks } from '../../store/thunksDayReducer';
import { Sidebar } from '../../component/sidebar/Sidebar';
import { SuccessEditModal } from '../../component/modal/Modal';
import Editor from '../../component/editor/Editor';
import { AllMessages } from '../../component/allMessages/AllMessages';

import {
  changeEditorContent,
  toggleActiveFillEditor,
  toggleEditorOldContent,
} from '../../store/editorReducer';
import useShallowEqualSelector from '../../hooks/useShallowEqualSelector';
import styles from './notes.module.css';

export const Notes: FC = () => {
  const activeFillEditor = useShallowEqualSelector(
    (state) => state.editor.activeFillEditor
  );
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getNotesSelectedDay());
    dispatch(fetchToDayThanks());
  }, [dispatch]);

  const handelHideEditor = useCallback(
    (value) => {
      dispatch(toggleActiveFillEditor(true));
      dispatch(toggleEditorOldContent(false));
      dispatch(changeEditorContent(''));
    },
    [dispatch],
  );

  return (
    <div className={styles.pageDay}>
      <div className={styles.pageDayContent}>
        <SuccessEditModal />
        <AllMessages />
        <div className={styles.editor}>
          {!activeFillEditor && (
            <Button className={styles.button} color="default" onClick={handelHideEditor}>
              Скрыть
            </Button>
          )}
          <Editor />
        </div>
      </div>
      <Sidebar />
    </div>
  );
};
