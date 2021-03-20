import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';

import useCredentials from '../../../hooks/useCredentials';
import useError from '../../../hooks/useError';

// PAGE STRUCTURE:
// - Username input
// - Email input
// - Password input
// - Password confirmation input
// - Sign up button
// - Login link

// API REQUESTS
// @post    /api/users

const Register = () => {
  const history = useHistory();

  const [loggedIn, setLoggedIn] = useCredentials();
  const handleError = useError();

  const [field, setField] = useState({
    name: '',
    email: '',
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
    if (field.name === '') {
      handleError('Username is required');
    } else if (field.name.length > 15) {
      handleError('Username too long');
    } else if (field.email === '') {
      handleError('Email is required');
    } else if (
      // At least 8 char, uppercase, lowercase and number included
      !/^(?=.*[a-z])(?=.*\d)(?=.*[A-Z])(?=.{8,})$/.test(field.password)
    ) {
      handleError('Invalid password');
    } else if (field.password !== field.confirmPassword) {
      handleError(`The two passwords don't match`);
    } else {
      try {
        const res = await axios.post('/api/users', {
          name: field.name,
          email: field.email,
          password: field.password,
        });

        // Login and redirect to /places
        const { id } = res.data;
        await setLoggedIn(id);
        history.push('/places');
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
            name='name'
            id='username'
            type='text'
            onChange={handleChange}
          />
          <label htmlFor='username'>Name</label>
        </div>
        <div className='input-field'>
          <input name='email' type='email' id='email' onChange={handleChange} />
          <label htmlFor='email'>Email</label>
        </div>
        <div className='input-field'>
          <input
            name='password'
            type='password'
            id='password'
            onChange={handleChange}
          />
          <label htmlFor='password'>Password</label>
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
          SIGN UP
        </button>
        <p style={{ marginTop: '1.5em', color: 'rgba(0,0,0,0.54)' }}>
          Already have an account? <a href='/login'>SIGN IN</a>
        </p>
      </form>
    </div>
  );
};

export default Register;
