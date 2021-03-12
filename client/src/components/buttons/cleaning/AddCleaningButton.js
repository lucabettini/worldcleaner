import React from 'react';
import { useHistory } from 'react-router-dom';
import useCredentials from '../../../hooks/useCredentials';

const AddCleaningButton = ({ id }) => {
  const [loggedIn, setLoggedIn] = useCredentials();
  const history = useHistory();

  const onCleaning = () => {
    if (!loggedIn) {
      history.push('/login');
    } else {
      history.push(`/clean/${id}`);
    }
  };

  return (
    <div>
      <div
        className='fixed-action-button'
        style={{
          position: 'fixed',
          bottom: '25px',
          right: '25px',
          zIndex: 3,
        }}
      >
        <button
          className='btn-floating waves-effect waves-light btn-large righteous primary-bg'
          onClick={onCleaning}
        >
          <i className='large material-icons light-text'>eco</i>
        </button>
      </div>
    </div>
  );
};

export default AddCleaningButton;
