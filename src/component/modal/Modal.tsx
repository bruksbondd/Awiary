import React, { FC } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Modal from '@material-ui/core/Modal'
import Backdrop from '@material-ui/core/Backdrop'
import Fade from '@material-ui/core/Fade'
import { useDispatch, useSelector } from 'react-redux'

import {
  toggleActiveFillEditor,
  toggleActiveModal,
  toggleEditorOldContent,
} from '../../store/editorReducer'
import { addNewNote, updateNote } from '../../store/noteReducer'
import { AppStateType } from '../../store'
import { validateContent } from '../../helpers/validateContent'

const useStyles = makeStyles((theme) => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}))

export const SuccessEditModal: FC = () => {
  const dispatch = useDispatch()
  const activeModal = useSelector((state: AppStateType) => state.editor.activeModal)
  const content = useSelector((state: AppStateType) => state.editor.content)
  const key = useSelector((state: AppStateType) => state.editor.key)

  const classes = useStyles()



  const handleEdit = async () => {
    console.log('handleEdit')
    validateContent(content)
    console.log(validateContent(content))
    dispatch(updateNote(content, key))

    dispatch(toggleActiveModal(false))
    dispatch(toggleActiveFillEditor(false))
    dispatch(toggleEditorOldContent(false))
  }

  const handleCreateNote = async () => {
    console.log('handleCreateNote')
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
        className={classes.modal}
        open={activeModal}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={activeModal}>
          <div className={classes.paper}>
            <h2 id="transition-modal-title">Transition modal</h2>
            <p id="transition-modal-description">
              react-transition-group animates me.
            </p>
            <button type="button" onClick={handleEdit}>
              Edit
            </button>
            <button type="button" onClick={handleCreateNote}>
              Create
            </button>
          </div>
        </Fade>
      </Modal>
    </div>
  )
}
