import React, { FC } from 'react'
import Modal from '@material-ui/core/Modal'
import Backdrop from '@material-ui/core/Backdrop'
import Fade from '@material-ui/core/Fade'
import Button from '@material-ui/core/Button'
import { useDispatch, useSelector } from 'react-redux'


import {
  toggleActiveFillEditor,
  toggleActiveModal,
  toggleEditorOldContent,
} from '../../store/editorReducer'
import { addNewNote, updateNote } from '../../store/noteReducer'
import { AppStateType } from '../../store'
import { validateContent } from '../../helpers/validateContent'
import styles from './modal.module.css'

export const SuccessEditModal: FC = () => {
  const dispatch = useDispatch()
  const activeModal = useSelector((state: AppStateType) => state.editor.activeModal)
  const content = useSelector((state: AppStateType) => state.editor.content)
  const key = useSelector((state: AppStateType) => state.editor.key)
  const handleEdit = async () => {
    validateContent(content)
    dispatch(updateNote(content, key))
    dispatch(toggleActiveModal(false))
    dispatch(toggleActiveFillEditor(false))
    dispatch(toggleEditorOldContent(false))
  }

  const handleCreateNote = async () => {
    validateContent(content)
    if (content !== '') {
      dispatch(addNewNote(content))
      dispatch(toggleActiveModal(false))
      dispatch(toggleEditorOldContent(false))
    }
  }

  const handleClose = () => {
    dispatch(toggleActiveModal(false))
  }

  return (
    <div>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={styles.modal}
        open={activeModal}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={activeModal}>
          <div className={styles.paper}>
            <h2 id="transition-modal-title">Выберите</h2>
            <p id="transition-modal-description">
              Какие действие вы хотите сделать
            </p>
            <div className="buttonGroup">
              <Button variant="contained" color="primary"   onClick={handleEdit}>
                Изменить
              </Button>
              <Button variant="contained" color="default" onClick={handleCreateNote}>
                Создать новый
              </Button>
            </div>
          </div>
        </Fade>
      </Modal>
    </div>
  )
}
