import React, { useState } from 'react';
import axios from 'axios';
import { useHistory, useParams } from 'react-router-dom';
import useCredentials from '../../../hooks/useCredentials';
import useError from '../../../hooks/useError';

const DeleteProfileButton = () => {
  const history = useHistory();
  const id = useParams().id;
  const [loggedIn, setLoggedIn] = useCredentials();
  const handleError = useError();
  const [click, setClick] = useState(false);

  const onDelete = async () => {
    setClick('loading');

    try {
      await axios.delete(`/api/users/${id}`, {
        withCredentials: true,
      });
      setClick('success');
      setTimeout(() => {
        history.push('/places');
      }, 500);
      if (loggedIn === id) {
        setLoggedIn('logout');
      }
    } catch (error) {
      handleError(error.response.data.msg, error.response.status);
      setClick(false);
    }
  };

  if (click === false) {
    return (
      <button
        onClick={onDelete}
        style={{ display: 'block', width: '100%', marginTop: '1em' }}
        className='waves-effect waves-light btn  red darken-4 light-text'
        type='button'
      >
        <i className='large material-icons light-text'>highlight_off</i> REMOVE
        ACCOUNT
      </button>
    );
  } else if (click === 'loading') {
    return (
      <button
        onClick={onDelete}
        style={{ display: 'block', width: '100%', marginTop: '1em' }}
        className='waves-effect waves-light btn  red darken-4 light-text'
        type='button'
      >
        <div className='preloader-wrapper active'>
          <div className='spinner-layer spinner-white-only'>
            <div className='circle-clipper left'>
              <div className='circle'></div>
            </div>
            <div className='gap-patch'>
              <div className='circle'></div>
            </div>
            <div className='circle-clipper right'>
              <div className='circle'></div>
            </div>
          </div>
        </div>
      </button>
    );
  } else if (click === 'success') {
    return (
      <button
        onClick={onDelete}
        style={{ display: 'block', width: '100%', marginTop: '1em' }}
        className='waves-effect waves-light btn  red darken-4 light-text'
        type='button'
      >
        <i className='large material-icons light-text'>done</i> ACCOUNT REMOVED
      </button>
    );
  }
};

export default DeleteProfileButton;
