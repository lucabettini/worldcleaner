import React, { useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import axios from 'axios';
import M from 'materialize-css/dist/js/materialize.min.js';

import useCredentials from '../../../hooks/useCredentials';
import useError from '../../../hooks/useError';

const Register = () => {
  const history = useHistory();
  const { slug } = useParams();
  const [loggedIn, setLoggedIn] = useCredentials();
  const handleError = useError();

  const [field, setField] = useState({
    password: '',
    confirmPassword: '',
  });

  const handleChange = (e) => {
    setField({
      ...field,
      [e.target.name]: e.target.value,
    });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    // Validation
    if (!/^(?=.*[a-z])(?=.*\d)(?=.*[A-Z])(?=.{8,})$/.test(field.password)) {
      handleError('Invalid password');
    } else if (field.password !== field.confirmPassword) {
      handleError(`The two passwords don't match`);
    } else {
      try {
        const res = await axios.patch(`/api/auth/resetPassword/${slug}`, {
          password: field.password,
        });

        // Save id on sessionStorage and exit
        const { id } = res.data;
        setLoggedIn(id);
        M.toast({ html: 'Password Changed' });
        setTimeout(() => {
          history.push('/places');
        }, 1500);
      } catch (error) {
        handleError(error.response.data.msg, error.response.status);
      }
    }
  };

  return (
    <div className='page-container form auth-form'>
      <form onSubmit={onSubmit}>
        <div className='input-field'>
          <input
            name='password'
            type='password'
            id='password'
            onChange={handleChange}
          />

          <label htmlFor='password'>New password</label>
        </div>
        <div className='input-field' style={{ marginBottom: '2em' }}>
          <input
            name='confirmPassword'
            type='password'
            id='confirmPassword'
            onChange={handleChange}
          />
          <label htmlFor='confirmPassword'>Confirm password</label>
          <span className='helper-text'>
            Password must be at least 8 characters long, with numbers, upper and
            lowercase letters.
          </span>
        </div>

        <button
          className='waves-effect waves-light btn primary-bg'
          type='submit'
        >
          CHANGE PASSWORD
        </button>
      </form>
    </div>
  );
};

export default Register;
