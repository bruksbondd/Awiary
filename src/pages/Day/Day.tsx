import React, { FC, useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import styles from './day.module.css';
import { AppStateType } from '../../store';
import { getNotesSelectedDay } from '../../store/noteReducer';
import { Note } from '../../component/note/Note';
import { fetchToDayThanks } from '../../store/thunksDayReducer';
import {Sidebar} from "../../component/sidebar/Sidebar";

export const Day: FC = () => {
  const selectedDate = useSelector(
    (state: AppStateType) => state.calendar.selectedDate
  );

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getNotesSelectedDay());
    dispatch(fetchToDayThanks());
  }, [dispatch]);

  if (selectedDate === null) {
    return <Redirect to="/" />;
  }

  return (
    <div className={styles.pageDay}>
      <div className={styles.pageDayContent}>
        <Note />
      </div>
     <Sidebar />
    </div>
  );
};
