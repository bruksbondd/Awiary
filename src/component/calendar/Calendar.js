import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import {
  format,
  startOfWeek,
  endOfMonth,
  addDays,
  startOfMonth,
  endOfWeek,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
  isFuture,
} from 'date-fns';
import { ru } from 'date-fns/locale';
import { useDispatch, useSelector } from 'react-redux';

import styles from './Calendar.module.css';
// import {Spinner} from '../spinner/Spinner'
// import ErrorBoundry from '../ErrorBoundry'

import { changeFormatDate } from '../../helpers/changeFormatDate';
import { fetchToDayData } from '../../store/calendarReducer';
import { fetchActivity } from '../../store/activityReducer';
import { getAllNotesMonth } from '../../store/noteReducer';
import {
  toggleEditorOldContent,
  changeEditorContent,
  toggleActiveFillEditor,
} from '../../store/editorReducer';
import SpaIcon from '@material-ui/icons/Spa';
import Brightness7Icon from '@material-ui/icons/Brightness7';
import useShallowEqualSelector from '../../hooks/useShallowEqualSelector';

const Calendar = (props) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  // const [activity, setActivity] = useState([]);

  const history = useHistory();
  const selectedDate = new Date();

  const allActivity = useSelector((state) => state.activity.allActivity);
  const allNotesMonth = useShallowEqualSelector((state) => state.notes.allNotesMonth);

  const dispatch = useDispatch();

  // const updateActivity = () => {
  //   if (activity !== allActivity) {
  //     dispatch(fetchActivity());
  //     setActivity(allActivity);
  //   }
  // };

  useEffect(() => {
    dispatch(fetchToDayData());
    dispatch(getAllNotesMonth());
    return dispatch(fetchActivity());
  }, [dispatch]);

  const renderHeader = () => {
    const dateFormat = 'LLLL yyyy';
    return (
      <div className={`${styles.header} ${styles.row}`}>
        <div className={`${styles.col} ${styles.colStart}`}>
          <div className={`${styles.icon}`} onClick={prevMonth}>
            chevron_left
          </div>
        </div>
        <div className={`${styles.col}  ${styles.colCenter}`}>
          <span>{format(currentMonth, dateFormat, { locale: ru })}</span>
        </div>
        <div className={`${styles.col} ${styles.colEnd}`} onClick={nextMonth}>
          <div className={`${styles.icon}`}>chevron_right</div>
        </div>
      </div>
    );
  };

  const renderDays = () => {
    const dateFormat = 'EEEE';
    const days = [];
    let startDate = startOfWeek(currentMonth, { weekStartsOn: 1 });
    for (let i = 0; i < 7; i++) {
      let dayWek = format(addDays(startDate, i), dateFormat, { locale: ru });
      days.push(
        <div className={`${styles.col} ${styles.colCenter} `} key={i}>
          {dayWek}
        </div>
      );
    }
    return <div className={`${styles.days} ${styles.row}`}>{days}</div>;
  };

  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
    const endDate = endOfWeek(monthEnd);

    const dateFormat = 'd';
    const rows = [];

    let days = [];
    let day = startDate;
    let formattedDate = '';

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        formattedDate = format(day, dateFormat);
        const cloneDay = day;
        // console.log(allActivity)
        //         const smileUse = allActivity.map((item) => {
        //
        //           let year = item[cloneDay.getFullYear()]
        //           let mount = year[cloneDay.getMonth() + 1]
        //           if (year && mount && mount[cloneDay.getDate()]) {
        //             return Object.values(mount[cloneDay.getDate()]).map((i) => {
        //               return (
        //                 <span
        //                   key={i.key}
        //                   className={`${styles.smile}`}
        //                 >
        // {i}
        //                   {/*{smiles[i.id-1].img}*/}
        //                 </span>
        //               )
        //             })
        //           }
        //         })

        const onDateClick = (day) => {
          history.push(`/day/${changeFormatDate(day)}`);
          dispatch(fetchToDayData(day));
          dispatch(toggleEditorOldContent(false));
          dispatch(changeEditorContent(''));
          dispatch(toggleActiveFillEditor(true));

          // this.setState({
          //   selectedDate: day
          // });
        };
        const year = cloneDay.getFullYear();
        const mount = cloneDay.getMonth() + 1;
        const today = cloneDay.getDate();

        const activitiesToday = allActivity.map((item) => {
          return Object.keys(item).map(i => {
            if (i === `${today}${mount}${year}`) {
              const meditation = item[i].activity.includes('Meditation') ? (
                <Brightness7Icon
                  className={styles.activity}
                  style={{ color: '#F6A4D5' }}
                />
              ) : null;

              const yoga = item[i].activity.includes('Yoga') ? (
                <SpaIcon style={{ color: '#F6A4D5' }} />
              ) : null;

              return (
                <div key={i} className={`${styles.allActivity}`}>
                  <span className={styles.activity}>{meditation}</span>
                  <span className={styles.activity}>{yoga}</span>
                </div>
              );
            }
          });
        });

        const notesToday = allNotesMonth.filter((item) => {
          if (
            item.date === `${today}${mount}${year}` && item.type === 'note'
          ) {
            return (
              item
            );
          }
        });
        const awarenesToday = allNotesMonth.filter((item) => {
          if (
            item.date === `${today}${mount}${year}` &&
            typeof item.content === 'string' && item.type === 'awareness'
          ) {
            return (
              item
            );
          }
        });

        days.push(
          <div
            className={`${styles.col} ${styles.cell}
              ${
                !isSameMonth(day, monthStart)
                  ? `disabled ${styles.disabled}`
                  : isSameDay(day, selectedDate)
                  ? `selected ${styles.selected}`
                  : ''
              }
              ${isFuture(day) ? `disabled ${styles.disabled}` : ''}
            `}
            key={day}
            onClick={() => onDateClick(cloneDay)}
          >
            <span className={`${styles.number}`}>{formattedDate}</span>
            <span className={`${styles.activities}`}>{activitiesToday}</span>
            {notesToday.length !== 0 ? <span className={`${styles.notesToday}`}>N: {notesToday.length}</span>: null}
            {awarenesToday.length !== 0 ?<span className={`${styles.awarenesToday}`}>A: {awarenesToday.length}</span>: null}
            <span className={`${styles.bg}`}>{formattedDate}</span>
          </div>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div className={`${styles.row}`} key={day}>
          {days}
        </div>
      );
      days = [];
    }
    return <div className={`${styles.body}`}>{rows}</div>;
  };

  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const prevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  // if(this.props.loadingSmiles) {
  //   return <Spinner/>
  // }

  // if(this.props.errorSmiles) {
  //   return <ErrorBoundry />
  // }

  return (
    <div className={`${styles.calendar}`}>
      {renderHeader()}
      {renderDays()}
      {renderCells()}
    </div>
  );
};

export default Calendar;
