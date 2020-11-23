import React, { FC, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Brightness5Icon from '@material-ui/icons/Brightness5';
import Brightness7Icon from '@material-ui/icons/Brightness7';

import SpaOutlinedIcon from '@material-ui/icons/SpaOutlined';
import SpaIcon from '@material-ui/icons/Spa';

import styles from './activityEvent.module.css';

import {
  addActivity,
  removeActivity,
  fetchToDayActivity,
} from '../../store/activityReducer';

export const ActivityEvent: FC = () => {
  const dispatch = useDispatch();

  const todayActivity = useSelector(
    (state: {active: {todayActivity: any}}) => state.active.todayActivity
  );

  const activeMeditation =
    todayActivity && todayActivity.includes('Meditation');
  const activeYoga = todayActivity && todayActivity.includes('Yoga');

  useEffect(() => {
  dispatch(fetchToDayActivity());
  }, [dispatch]);

  const handleActive = (name: string) => {
    const active = todayActivity.includes(name);
    if (active) {
      dispatch(removeActivity(name));
    } else {
      dispatch(addActivity(name));
    }
  };

  return (
    <div className={styles.actionBox}>
      <div
        className={styles.actionItem}
        onClick={() => handleActive('Meditation')}
      >
        {activeMeditation ? (
          <Brightness7Icon style={{ color: '#F6A4D5' }} />
        ) : (
          <Brightness5Icon style={{ color: '#AFBAD1' }} />
        )}
        <p className={styles.actionText}>Meditation</p>
      </div>
      <div className={styles.actionItem} onClick={() => handleActive('Yoga')}>
        {activeYoga ? (
          <SpaIcon style={{ color: '#F6A4D5' }} />
        ) : (
          <SpaOutlinedIcon style={{ color: '#AFBAD1' }} />
        )}
        <p className={styles.actionText}>Yoga</p>
      </div>
    </div>
  );
};
