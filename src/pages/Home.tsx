import React, { FC } from 'react';
import Calendar from '../component/calendar/Calendar';
// import Calendar from '../components/calendar/Calendar';

export const Home: FC = (props) => {
  return (
    <div>
      <section>
        <Calendar {...props} />
      </section>
    </div>
  );
};
