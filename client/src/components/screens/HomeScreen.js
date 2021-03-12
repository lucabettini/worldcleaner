import React from 'react';
import { useHistory } from 'react-router-dom';

import icon from '../../styles/img/logo.svg';

import useCredentials from '../../hooks/useCredentials';

const HomeScreen = () => {
  const history = useHistory();

  const [loggedIn] = useCredentials();

  const onGetStarted = () => {
    if (loggedIn) {
      history.push('/places');
    } else {
      history.push('/login');
    }
  };

  return (
    <div className='home container'>
      <div className='row'>
        <div className='col m12 l6'>
          <div>
            <h1 className='center-align righteous primary-text home-title'>
              WORLD CLEANER
            </h1>
          </div>
          <div>
            <p className='center-align righteous primary-text'>
              A HELPFUL TOOL TO CHANGE THE WORLD
            </p>
          </div>
          <div className='home-buttons'>
            <button
              className='righteous waves-effect waves-light btn primary-bg'
              onClick={onGetStarted}
            >
              GET STARTED
            </button>
            <button
              className='righteous waves-effect waves-light btn primary-bg'
              onClick={() => {
                history.push('/places');
              }}
            >
              EXPLORE
            </button>
          </div>
        </div>
        <div className='col m12 l6'>
          <img
            src={icon}
            className='home-img'
            style={{
              width: '100%',
              margin: '0 auto',
              display: 'block',
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default HomeScreen;
