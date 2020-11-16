import { withStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import { purple } from '@material-ui/core/colors'
import React, { useCallback } from "react"
import { useDispatch } from "react-redux"
import {
  changeEditorContent,
  changeSelectedType,
  toggleActiveFillEditor,
  toggleEditorOldContent
} from "../../store/editorReducer"
import useShallowEqualSelector from "../../hooks/useShallowEqualSelector";
import styles from './editorPanel.module.css';

export const EditorPanel = () => {

  const dispatch = useDispatch()
  const select = useShallowEqualSelector((state) => state.editor.selectedType);
  const activeFillEditor = useShallowEqualSelector((state) => state.editor.activeFillEditor);

  const selectedType = useCallback((selected) => {
    dispatch(changeSelectedType(selected))
    dispatch(toggleActiveFillEditor(false))
  }, [dispatch])

  const handelHideEditor = useCallback((value) => {
    console.log('handelHideEditor', value)
    dispatch(toggleActiveFillEditor(true))
    dispatch(toggleEditorOldContent(false))
    dispatch(changeEditorContent(''))
  }, [dispatch])

  const handelClearEditor = useCallback(() => {
    console.log('handelClearEditor')
    dispatch(toggleEditorOldContent(false))
    dispatch(changeEditorContent(''))
  }, [dispatch])

  const NoteButton = withStyles((theme) => ({
    root: {
      color: theme.palette.getContrastText(purple[500]),
      backgroundColor: select === 'note' ? '#B6A6F7' : 'default',
      '&:hover': {
        opacity: '0.8',
      },
    },
  }))(Button);

  const AwarenessButton = withStyles((theme) => ({
    root: {
      color: theme.palette.getContrastText(purple[500]),
      backgroundColor: select === 'note' ? 'default' : '#F6A4D5',
      '&:hover': {
        opacity: '0.8',
      },
    },
  }))(Button);

  const CleanButton = withStyles((theme) => ({
    root: {
      color: "#4F68A2",
      backgroundColor: "#ffffff",
      border: "1px solid #4F68A2",
      '&:hover': {
        opacity: "0.8",
      },
    },
  }))(Button);

  const HiddenButton = withStyles((theme) => ({
    root: {
      color: "#4F68A2",
      backgroundColor: "#ffffff",
      border: "1px solid #4F68A2",
      '&:hover': {
        opacity: "0.8",
      },
    },
  }))(Button);

  return (
    <div className={styles.editor_panel}>
      <div className={styles.editor_panel_group}>
        <NoteButton variant="contained" color="default"
                    onClick={() => selectedType("note")}>Заметка</NoteButton>
        <AwarenessButton variant="contained" color="default"
                         onClick={() => selectedType("awareness")}>Осознание</AwarenessButton>
      </div>
      {!activeFillEditor && (<div className={styles.editor_panel_group}>
        <CleanButton color="default"
                     onClick={handelClearEditor}>Очистить</CleanButton>
        <HiddenButton color="default"
                      onClick={handelHideEditor}>Скрыть</HiddenButton>
      </div>)}
    </div>
  )
}