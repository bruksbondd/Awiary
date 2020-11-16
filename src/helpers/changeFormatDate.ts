export const changeFormatDate = (timestamp = new Date(), divide = '') => {
  const d = new Date(timestamp);
  return `${d.getDate()}${divide}${
    d.getMonth() + 1
  }${divide}${d.getFullYear()}`;
};
export const changeReverseFormatDate = (timestamp = new Date()) => {
  const d = new Date(timestamp);
  return `${d.getFullYear()}/${d.getMonth() + 1}/${d.getDate()}`;
};

export const reverseFormatDate = (timestamp = new Date()) => {
  const d = new Date(timestamp);
  return `[${d.getFullYear()}][${d.getMonth() + 1}][${d.getDate()}]`;
};

export const formatDate = (date = new Date()) => {
  // return ('0' +(date.getDate())).slice(-2)+('0' +(date.getMonth()+1)).slice(-2)+('0'+date.getFullYear()).slice(-4);
  return `${date.getDate()}${date.getMonth() + 1}${date.getFullYear()}`;
};
