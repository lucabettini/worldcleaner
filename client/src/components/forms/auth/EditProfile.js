import React, { useState, useEffect, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';

import M from 'materialize-css/dist/js/materialize.min.js';

import useCredentials from '../../../hooks/useCredentials';
import useError from '../../../hooks/useError';

import DeleteProfileButton from '../../buttons/profile/DeleteProfileButton';

// PAGE STRUCTURE:
// - Change username input
// - Change/add description input
// - Change/add location input
// - Change password link (to ChangePassword form component)
// - DeleteProfileButton

// API REQUESTS
// @patch   /api/users/:id

const EditPlace = () => {
  const history = useHistory();

  const [loggedIn, setLoggedIn] = useCredentials();
  const id = loggedIn;
  const handleError = useError();

  const [user, setUser] = useState({});
  const [status, setStatus] = useState('loading');

  // Instead of onChange, refs are used in combination with
  // defaultValue to prepopulate the form with useEffect
  const nameRef = useRef(null);
  const descriptionRef = useRef(null);
  const locationRef = useRef(null);

  // Populate form with values stored on db
  useEffect(async () => {
    try {
      const { data } = await axios.get(`/api/users/${id}`);
      setUser({
        nameValue: data.name,
        descriptionValue: data.description ?? null,
        locationValue: data.location ?? null,
      });
      setStatus('succeeded');
      M.updateTextFields();
    } catch (error) {
      handleError(error.response.data.msg, error.response.status);
      setStatus('failed');
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {};
    if (nameRef.current.value) {
      data.name = nameRef.current.value;
    }
    if (descriptionRef.current.value) {
      data.description = descriptionRef.current.value;
    }
    if (locationRef.current.value) {
      data.location = locationRef.current.value;
    }

    // Send new values to server
    try {
      await axios.patch(`/api/users/${id}`, data, {
        withCredentials: true,
      });
      history.push(`/users/${id}`);
    } catch (error) {
      handleError(error.response.data.msg, error.response.status);
    }
  };

  if (status !== 'succeeded') {
    return (
      <div className='page-container'>
        <div className='progress'>
          <div className='indeterminate'></div>
        </div>
      </div>
    );
  } else {
    return (
      <div className='page-container form'>
        <form onSubmit={handleSubmit}>
          <div className='input-field'>
            <input
              name='name'
              id='name'
              type='text'
              ref={nameRef}
              defaultValue={user.nameValue}
            />
            <label htmlFor='name'>Username *</label>
          </div>
          <div className='input-field'>
            <textarea
              name='description'
              id='description'
              type='text'
              className='materialize-textarea'
              ref={descriptionRef}
              defaultValue={user.descriptionValue}
            />
            <label htmlFor='description'>
              Additional infos about yourself (optional)
            </label>
          </div>
          <div className='input-field'>
            <textarea
              name='location'
              id='location'
              type='text'
              className='materialize-textarea'
              ref={locationRef}
              defaultValue={user.locationValue}
            />
            <label htmlFor='description'>Location (optional)</label>
          </div>
          <a
            href='/changePassword'
            style={{ display: 'block', marginBottom: '2em' }}
          >
            Change password?
          </a>

          <button
            className='waves-effect waves-light btn primary-bg'
            type='submit'
          >
            EDIT PROFILE
          </button>
          <DeleteProfileButton />
        </form>
      </div>
    );
  }
};

export default EditPlace;
