import React from 'react';
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
import { connect } from 'react-redux';

import styles from './Calendar.module.css';
// import {Spinner} from '../spinner/Spinner'
// import ErrorBoundry from '../ErrorBoundry'

import { changeFormatDate } from '../../helpers/changeFormatDate';
import { fetchToDayData } from '../../store/calendarReducer';
import { fetchActivity } from '../../store/activityReducer';
import {
  toggleEditorOldContent,
  changeEditorContent,
  toggleActiveFillEditor,
} from '../../store/editorReducer';

class Calendar extends React.Component {
  state = {
    currentMonth: new Date(),
    selectedDate: new Date(),
  };

  componentDidMount () {
    this.props.fetchActivity();
  }

  componentDidUpdate(prevProps) {
    if (this.props !== prevProps) {
      this.props.fetchActivity();
    }
    console.log(prevProps.allActivity)
  }

  renderHeader() {
    const dateFormat = 'LLLL yyyy';
    return (
      <div className={`${styles.header} ${styles.row}`}>
        <div className={`${styles.col} ${styles.colStart}`}>
          <div className={`${styles.icon}`} onClick={this.prevMonth}>
            chevron_left
          </div>
        </div>
        <div className={`${styles.col}  ${styles.colCenter}`}>
          <span>
            {format(this.state.currentMonth, dateFormat, { locale: ru })}
          </span>
        </div>
        <div
          className={`${styles.col} ${styles.colEnd}`}
          onClick={this.nextMonth}
        >
          <div className={`${styles.icon}`}>chevron_right</div>
        </div>
      </div>
    );
  }

  renderDays() {
    const dateFormat = 'EEEE';
    const days = [];
    let startDate = startOfWeek(this.state.currentMonth, { weekStartsOn: 1 });
    for (let i = 0; i < 7; i++) {
      let dayWek = format(addDays(startDate, i), dateFormat, { locale: ru });
      days.push(
        <div className={`${styles.col} ${styles.colCenter} `} key={i}>
          {dayWek}
        </div>
      );
    }
    return <div className={`${styles.days} ${styles.row}`}>{days}</div>;
  }

  renderCells() {
    console.log(this.props)
    const { currentMonth, selectedDate } = this.state;
    const { allActivity } = this.props;
    console.log(allActivity)
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
        // let smileUse = this.props.allActivity.map((item) => {
        //   let year = item[cloneDay.getFullYear()]
        //   let mount = year[cloneDay.getMonth() + 1]
        //   if (year && mount && mount[cloneDay.getDate()]) {
        //     return Object.values(mount[cloneDay.getDate()]).map((i) => {
        //       return (
        //         <span
        //           key={i.key}
        //           className={`${styles.smile}`}
        //         >
        //           {this.props.smiles[i.id-1].img}
        //         </span>
        //       )
        //     })
        //   }
        // })

        days.push(
          <div
            className={`${styles.col} ${styles.cell}
              ${
                !isSameMonth(day, monthStart)
                  ? `disabled ${styles.disabled}`
                  : isSameDay(day, selectedDate) ? `selected ${styles.selected}` : ''
              }
              ${isFuture(day) ? `disabled ${styles.disabled}` : ''}
            }`}
            key={day}
            onClick={() => this.onDateClick(cloneDay)}
          >
            <span className={`${styles.number}`}>{formattedDate}</span>
            {/*<span className={`${styles.smiles}`}>{smileUse}</span>*/}
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
  }

  onDateClick = (day) => {
    this.props.history.push(`/day/${changeFormatDate(day)}`);
    this.props.fetchToDayData(day);
    this.props.toggleEditorOldContent(false);
    this.props.changeEditorContent('');
    this.props.toggleActiveFillEditor(true);

    // this.setState({
    //   selectedDate: day
    // });
  };

  nextMonth = () => {
    this.setState({
      currentMonth: addMonths(this.state.currentMonth, 1),
    });
  };

  prevMonth = () => {
    this.setState({
      currentMonth: subMonths(this.state.currentMonth, 1),
    });
  };

  render() {
    // if(this.props.loadingSmiles) {
    //   return <Spinner/>
    // }

    // if(this.props.errorSmiles) {
    //   return <ErrorBoundry />
    // }

    return (
      <div className={`${styles.calendar}`}>
        {this.renderHeader()}
        {this.renderDays()}
        {this.renderCells()}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    allActivity: state.activity.allActivity,
    selectedDay: state.calendar.selectedDay,
  };
};

export default connect(mapStateToProps, {
  fetchActivity,
  fetchToDayData,
  toggleEditorOldContent,
  changeEditorContent,
  toggleActiveFillEditor,
})(Calendar);
