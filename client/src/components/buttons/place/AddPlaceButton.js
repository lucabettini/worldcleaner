import React from 'react';
import { useHistory } from 'react-router-dom';

import useStorage from '../../../hooks/useStorage';

const AddPlaceButton = () => {
  const history = useHistory();
  const [loggedIn, setLoggedIn] = useStorage();

  const redirectAdd = () => {
    if (!loggedIn || loggedIn === '') {
      history.push('/login');
    } else {
      history.push('/addPlace');
    }
  };

  return (
    <button
      className='waves-effect waves-light btn dark-bg light-text'
      style={{ width: '100%' }}
      onClick={redirectAdd}
    >
      <i className='large material-icons light-text'>add</i> ADD A NEW PLACE
    </button>
  );
};

export default AddPlaceButton;
