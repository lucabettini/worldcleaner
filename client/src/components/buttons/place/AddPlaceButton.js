import React from 'react';
import { useHistory } from 'react-router-dom';

import useCredentials from '../../../hooks/useCredentials';

const AddPlaceButton = () => {
  const history = useHistory();
  const [loggedIn, setLoggedIn] = useCredentials();

  const redirectAdd = () => {
    if (!loggedIn || loggedIn === '') {
      history.push('/login');
    } else {
      history.push('/addPlace');
    }
  };

  return (
    <button
      className='waves-effect waves-light btn-large dark-bg light-text righteous'
      style={{ width: '100%', fontSize: '1.4em' }}
      onClick={redirectAdd}
    >
      <i className='large material-icons light-text'>add</i> ADD A NEW PLACE
    </button>
  );
};

export default AddPlaceButton;
