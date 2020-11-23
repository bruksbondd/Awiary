import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import logo from './logo.svg';
import icon from './signOut.svg';
import styles from './header.module.css';

import { logout } from '../../store/authReducer';
import { AppStateType } from '../../store';
import { changeFormatDate } from '../../helpers/changeFormatDate';
import { changeTypePage } from '../../store/noteReducer'

const Header = () => {
  const dispatch = useDispatch();
  const selectedDate = useSelector(
    (state: AppStateType) => state.calendar.selectedDate
  );

  const data = selectedDate ? changeFormatDate(selectedDate, '/') : changeFormatDate(new Date(), '/')

  const changeType = (type: string) => {
    dispatch(changeTypePage(type))
  }

  return (
    <header>
      <div className={styles.headerContainer}>
        <div className={styles.headerLogo}>
          <Link to="/">
            <img className={styles.logo} src={logo} alt="Awiary" />
          </Link>
        </div>
        <div className={styles.headerDate}>
          {data}
        </div>
        <div className={styles.headerNavigationBlock}>
          <nav className={styles.headerNavigation}>
            <Link className={styles.headerNavigationItem} to="/">
              Календарь
            </Link>
            <Link
              className={`${styles.headerNavigationItem} ${styles.headerNavigationItemCenter}`}
              to="/note"
              onClick={() => changeType('note')}
            >
              Заметки
            </Link>
            <Link className={styles.headerNavigationItem} to="/awareness" onClick={() => changeType('awareness')}>
              Осознания
            </Link>
          </nav>
          <Link
            onClick={() => dispatch(logout())}
            className={styles.headerLogout}
            to="/"
          >
            <img src={icon} alt="error icon" />
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
