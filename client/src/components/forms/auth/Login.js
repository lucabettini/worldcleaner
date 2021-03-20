import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';

import useCredentials from '../../../hooks/useCredentials';
import useError from '../../../hooks/useError';

// PAGE STRUCTURE:
// - Email input
// - Password input
// - Forgot password link
// - Log In button
// - Register link

// API REQUESTS
// @post    /api/auth/login

const Login = () => {
  const history = useHistory();

  const [loggedIn, setLoggedIn] = useCredentials();
  const handleError = useError();

  const [field, setField] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    setField({
      ...field,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validation
    if (field.email === '') {
      handleError('Email is required');
    } else if (field.password === '') {
      handleError('Password is required');
    } else {
      try {
        const res = await axios.post('/api/auth/login', {
          email: field.email,
          password: field.password,
        });

        // If user is admin, his ID on sessionStorage is saved
        // as 'admin'. Otherwise is logged in as a regular user.
        const { id, isAdmin } = res.data;
        if (isAdmin) {
          await setLoggedIn('admin');
        } else {
          await setLoggedIn(id);
        }
        history.push('/places');
      } catch (error) {
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
        <div className='input-field' style={{ marginBottom: '40px' }}>
          <input
            name='password'
            id='password'
            type='password'
            onChange={handleChange}
          />
          <label htmlFor='password'>Password</label>
          <span className='helper-text'>
            <a href='/forgotPassword'>Forgot password?</a>
          </span>
        </div>
        <button
          className='waves-effect waves-light btn primary-bg'
          type='submit'
        >
          SIGN IN
        </button>
        <p style={{ marginTop: '1.5em', color: 'rgba(0,0,0,0.54)' }}>
          Need an account? <a href='/register'>SIGN UP</a>
        </p>
      </form>
    </div>
  );
};

export default Login;
