import React, { FC } from 'react';
import styles from './sidebar.module.css';
import SidebarCalendar from '../sidebarCalendar/SidebarCalendar';
import { InputDay } from '../inputDay/InputDay';
import { ActivityEvent } from '../activityEvent/ActivityEvent';
import { useSelector } from 'react-redux';
import { AppStateType } from '../../store';

export const Sidebar: FC = () => {
  const selectedDate = useSelector(
    (state: AppStateType) => state.calendar.selectedDate
  );
  const thunksValue = useSelector((state: AppStateType) => state.thunks.thunk);

  const thoughtValue = useSelector(
    (state: AppStateType) => state.thunks.thought
  );
  console.log(thoughtValue)
  return (
    <div className={styles.pageDaySideBar}>
      <SidebarCalendar />
      <InputDay
        title="Мысль дня:"
        type="thought"
        value={thoughtValue}
        selectedDate={selectedDate}
      />
      <InputDay
        title="Благодарность:"
        type="thunks"
        value={thunksValue}
        selectedDate={selectedDate}
      />
      <ActivityEvent />
    </div>
  );
};
