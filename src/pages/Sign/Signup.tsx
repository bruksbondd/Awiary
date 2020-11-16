import React, { ChangeEvent, FC, FormEvent, useState } from 'react';
import { Link } from 'react-router-dom';

import { signup, signInWithGoogle } from '../../helpers/auth';
import styles from './Sign.module.css';
import google from './google.svg';

export const SignUp: FC = () => {
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleChangeEmail = (event: ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handleChangePassword = (event: ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError('');
    try {
      await signup(email, password);
    } catch (error) {
      setError(error.message);
    }
  };

  const googleSignIn = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      setError(error.message);
    }
  };

  return (
      <div className={`container ${styles.wrapper}`}>
        <form
            className={`mt-5 py-5 px-5 ${styles.form_box}`}
            autoComplete="off"
            onSubmit={handleSubmit}
        >
          <h1 className={styles.header_block}>
            Зарегистрироваться в
            <Link className={`${styles.title} ml-2`} to="/">
              Awiary
            </Link>
          </h1>
          <div className="form-group">
            <input
                className="form-control"
                placeholder="Email"
                name="email"
                type="email"
                onChange={handleChangeEmail}
                value={email}
            />
          </div>
          <div className="form-group">
            <input
                className="form-control"
                placeholder="Password"
                name="password"
                onChange={handleChangePassword}
                value={password}
                type="password"
            />
          </div>
          <div className="form-group">
            {error ? <p className="text-danger">{error}</p> : null}
            <button className={`${styles.submit} btn btn-primary px-5`} type="submit">
              Зарегистрироваться
            </button>
          </div>
          <div className={styles.signGoogle}>
            <p>Вы также можете Зарегистрироваться через Google аккаунт</p>
            <button
                className="btn btn-danger mr-2"
                type="button"
                onClick={googleSignIn}
            >
              <img src={google} alt="Google" />
            </button>
          </div>
          <p>
            <Link className={styles.signup} to="/login">
              Войти
            </Link>
          </p>
        </form>
      </div>
  );
};
