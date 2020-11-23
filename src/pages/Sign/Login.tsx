import React, { ChangeEvent, FC, FormEvent, useState } from 'react';
import { Link } from 'react-router-dom';

import { signin, signInWithGoogle } from '../../helpers/auth';
import styles from './Sign.module.css';
import google from './google.svg';
import { Footer } from '../../component/Footer'

export const Login: FC = () => {
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
      await signin(email, password);
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
    <>
    <div className={`container ${styles.wrapper}`}>
      <form
        className={`mt-5 py-5 px-5 ${styles.form_box}`}
        autoComplete="off"
        onSubmit={handleSubmit}
      >
        <h1 className={styles.header_block}>
          Войти в
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
            Войти
          </button>
        </div>
        <div className={styles.signGoogle}>
          <p>Вы также можете авторизироваться через Google аккаунт</p>
          <button
            className="btn btn-danger mr-2"
            type="button"
            onClick={googleSignIn}
          >
            <img src={google} alt="Google" />
          </button>
        </div>
        <p>
          <Link className={styles.signup} to="/signup">
            Зарегистрироваться
          </Link>
        </p>
      </form>
      <Footer />
    </div>

      </>
  );
};
