import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';

import M from 'materialize-css/dist/js/materialize.min.js';
import useError from '../../../hooks/useError';

const ForgotPassword = () => {
  const history = useHistory();
  const handleError = useError();

  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const handleChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (email === '') {
      handleError('Email is required');
    } else {
      try {
        await axios.post('/api/auth/forgotPassword', {
          email: email,
        });
        setSent(true);
        M.toast({ html: 'Check your email!' });
        setTimeout(() => {
          history.push('/login');
        }, 4000);
      } catch (error) {
        setSent(false);
        handleError(error.response.data.msg, error.response.status);
      }
    }
  };

  return (
    <div className='page-container form auth-form'>
      <form onSubmit={handleSubmit}>
        <div className='input-field'>
          <input name='email' id='email' type='text' onChange={handleChange} />
          <label htmlFor='email'>Email</label>
        </div>
        <button
          className='waves-effect waves-light btn primary-bg'
          type='submit'
          disabled={sent}
        >
          SEND EMAIL
        </button>
      </form>
    </div>
  );
};

export default ForgotPassword;
