import React, { useEffect, useState, ChangeEvent, FC } from 'react';
import SaveIcon from '@material-ui/icons/Save';
import styles from './inputDay.module.css';
import { useDispatch } from 'react-redux';

import { addThanks, fetchToDayThanks } from './../../store/thunksDayReducer';
import { isSameDay } from 'date-fns';

type PropsType = {
  title: string;
  type: string;
  value: string;
  selectedDate: Date;
};

export const InputDay: FC<PropsType> = ({
  title,
  type,
  value,
  selectedDate,
}) => {
  const [text, setText] = useState('');
  const [editMode, setEditMode] = useState(true);
  const [hadChange, setHadChange] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchToDayThanks());
    setText(value);
    if (value) {
      setEditMode(false);
    } else {
      setEditMode(true);
    }
  }, [dispatch, value]);

  const changeText = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    if (text !== value) {
      setHadChange(true);
    }
  };

  const activeEditMode = () => {
    setEditMode(true);
  };

  const deActiveEditMode = () => {
    dispatch(addThanks(text, type));
    setEditMode(false);
    setHadChange(false);
  };
  if (editMode && isSameDay(selectedDate, new Date())) {
    return (
      <div className={styles.blockInput}>
        <p className={styles.inputTitle}>{title}</p>
        <textarea
          className={styles.input}
          rows={3}
          value={text}
          onChange={changeText}
          autoFocus
        >
          {' '}
        </textarea>

        <SaveIcon
          className={styles.save}
          onClick={deActiveEditMode}
          style={hadChange ? { color: '#3f51b5' } : { color: '#AFBAD1' }}
        />
      </div>
    );
  }

  return (
    <div className={styles.blockInput}>
      <p className={styles.inputTitle}>{title}</p>
      <div onClick={activeEditMode}>
        <p className={styles.showText}>{text}</p>
      </div>
    </div>
  );
};
