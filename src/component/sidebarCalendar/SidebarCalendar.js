import React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
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

import styles from './sidebarCalendar.module.css';
import { changeFormatDate } from '../../helpers/changeFormatDate';
import { fetchToDayData } from '../../store/calendarReducer';
import {
  changeEditorContent,
  toggleActiveFillEditor,
  toggleEditorOldContent,
} from '../../store/editorReducer';
import { fetchToDayActivity } from '../../store/activityReducer';
import {fetchToDayThanks} from "../../store/thunksDayReducer";

class Calendar extends React.Component {
  state = {
    currentMonth: new Date(),
  };

  renderHeader() {
    const dateFormat = 'MMMM yyyy';
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
    const dateFormat = 'EEE';
    const days = [];
    let startDate = startOfWeek(this.state.currentMonth);
    for (let i = 0; i < 7; i++) {
      let dayWek = format(addDays(startDate, i), dateFormat, { locale: ru });
      days.push(
        <div
          className={`${styles.col} ${styles.colCenter} ${styles.dayWek}`}
          key={i}
        >
          {dayWek}
        </div>
      );
    }
    return <div className={`${styles.days} ${styles.row}`}>{days}</div>;
  }

  renderCells() {
    const { currentMonth } = this.state;
    const { selectedDate } = this.props;
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
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

        days.push(
          <div
            className={`${styles.col} ${styles.cell}
              ${
                !isSameMonth(day, monthStart)
                  ? `disabled ${styles.disabled}`
                  : isSameDay(day, new Date())
                  ? `selected ${styles.selected}`
                  : ''
              }
              ${isSameDay(day, selectedDate) ? styles.selectedDay : ''}
              ${isFuture(day) ? `disabled ${styles.disabled}` : ''}
            }`}
            key={day}
            onClick={() => this.onDateClick(cloneDay)}
          >
            <span className={`${styles.number}`}>{formattedDate}</span>

            <span className={`${styles.bg}`}></span>
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
    this.props.fetchToDayActivity();
    this.props.fetchToDayThanks();
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
    selectedDate: state.calendar.selectedDate
    // loadingSmiles: state.smile.loadingSmiles,
    // errorSmiles: state.smile.errorSmiles,
  };
};

export default connect(mapStateToProps, {
  fetchToDayData,
  toggleEditorOldContent,
  changeEditorContent,
  toggleActiveFillEditor,
  fetchToDayActivity,
  fetchToDayThanks,
})(withRouter(Calendar));
