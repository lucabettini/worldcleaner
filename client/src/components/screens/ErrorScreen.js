import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { clearError } from '../../redux/placesSlice';

const errorContainer = {
  minHeight: 'calc(100vh - 20px)',
};

const errorText = {
  fontSize: '1.5em',
  paddingBottom: '0.5em',
};

const ErrorScreen = () => {
  const dispatch = useDispatch();

  // Resets global state to error: false after
  // this screen is rendered.
  useEffect(() => {
    return () => {
      dispatch(clearError);
    };
  }, []);

  return (
    <div style={errorContainer}>
      <div className='container'>
        <div className='row'>
          <div className='col s12'>
            <p className='primary-text error-title'>
              Oops! Something went wrong
            </p>
            <p className='dark-text' style={errorText}>
              Either we couldn't find what you are looking for or some
              unexpected black magic happened on the server.
            </p>
            <p className='dark-text' style={errorText}>
              While we send our oompa-loompas squad to check, you can{' '}
              <a className='primary-text' href='/'>
                go back and try something else.
              </a>
            </p>
            <p style={errorText}>
              If the problem persists,{' '}
              <a
                href='https://lucabettini.com'
                target='_blank'
                rel='noopener noreferrer'
                className='primary-text'
              >
                please let me know.
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErrorScreen;
