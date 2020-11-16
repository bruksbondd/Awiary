export const validateContent = (content) => {
  let text = content
  if (text && text.length > 0) {
    text = text.replace(/<(?:.|\n)*?>/gm, '').replace('&nbsp;', '').trim()
    text = text.length ? text.split(/\s+/).length : 0
  } else {
    text = 0
  }
  // if (text === 0) {
  //   dispatch(changeEditorContent(''))
  // }
}
