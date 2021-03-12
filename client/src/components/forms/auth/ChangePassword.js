import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import M from 'materialize-css/dist/js/materialize.min.js';
import useCredentials from '../../../hooks/useCredentials';
import useError from '../../../hooks/useError';

const ChangePassword = () => {
  const history = useHistory();
  const handleError = useError();

  const [loggedIn, setLoggedIn] = useCredentials();

  const [field, setField] = useState({
    oldPassword: '',
    newPassword: '',
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
    if (!/^(?=.*\d)(?=.*[a-zA-Z])(?!.*\s).{8,}$/.test(field.newPassword)) {
      handleError('Invalid password');
    } else {
      try {
        await axios.patch(
          '/api/auth/changePassword',
          {
            oldPassword: field.oldPassword,
            newPassword: field.newPassword,
          },
          {
            withCredentials: true,
          }
        );
        M.toast({ html: 'Password changed' });
        setTimeout(() => {
          history.push(`/users/${loggedIn}`);
        }, 2000);
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
            name='oldPassword'
            type='password'
            id='oldPassword'
            onChange={handleChange}
          />

          <label htmlFor='oldPassword'>Current password</label>
        </div>
        <div className='input-field' style={{ marginBottom: '2em' }}>
          <input
            name='newPassword'
            type='password'
            id='newPassword'
            onChange={handleChange}
          />
          <label htmlFor='newPassword'>New password</label>
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

export default ChangePassword;
