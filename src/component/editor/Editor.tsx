import React from 'react'
import { useDispatch } from 'react-redux'
import SunEditor from 'suneditor-react'
// eslint-disable-next-line import/no-extraneous-dependencies
import 'suneditor/dist/css/suneditor.min.css'
import { changeEditorContent, saveContent } from '../../store/editorReducer'
import useShallowEqualSelector from '../../hooks/useShallowEqualSelector'
import { AppStateType } from '../../store'

const Editor = () => {
  const content = useShallowEqualSelector((state: AppStateType) => state.editor.content)
  const activeFillEditor = useShallowEqualSelector((state) => state.editor.activeFillEditor)
  const dispatch = useDispatch()

  const handleChange = (text: string) => {
    dispatch(changeEditorContent(text))
  }

  const handleSaveContent = (text: string) => {
    dispatch(saveContent(text))
  }
  return (
    <SunEditor
      hide={activeFillEditor}
      setContents={content}
      onChange={handleChange}
      lang="ru"
      setOptions={{
        showPathLabel: false,
        maxCharCount: 720,
        width: '100%',
        height: 'auto',
        minHeight: '100px',
        maxHeight: '250px',
        buttonList: [
          ['undo', 'redo', 'formatBlock'],
          ['bold', 'underline', 'italic', 'strike'],
          ['fontColor', 'hiliteColor', 'outdent', 'indent', 'align', 'horizontalRule', 'list', 'table'],
          ['link', 'image', 'fullScreen', 'showBlocks', 'codeView', 'preview', 'print', 'save']
        ],

        callBackSave: (text) => handleSaveContent(text),
      }}
    />
  )
}

export default Editor
