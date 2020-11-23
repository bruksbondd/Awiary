import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';

import styles from './spiner.module.css'

export const Spinner = () => {

  return (
    <div className={styles.spinner}>
      <CircularProgress />
    </div>
  );
};
