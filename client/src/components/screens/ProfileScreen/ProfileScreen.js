import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

import useCredentials from '../../../hooks/useCredentials';
import useError from '../../../hooks/useError';

import EditProfileButton from '../../buttons/profile/EditProfileButton';
import MyPlaces from './MyPlaces';

// PAGE STRUCTURE:
// Details on user (with edit links if user is the same)
// MyPlaces Component (two collapsibles with links)
// EditProfileButton (shown only if user is the same)

// API REQUESTS
// @get     /api/users/:id
// @get     /api/places (through MyPlaces component)

const ProfileScreen = () => {
  const [loggedIn, setLoggedIn] = useCredentials();
  const handleError = useError();

  const [isSameUser, setIsSameUser] = useState(false);
  const [userData, setUserData] = useState({});
  const [status, setStatus] = useState('loading');

  const id = useParams().id;

  useEffect(async () => {
    try {
      const { data } = await axios.get(`/api/users/${id}`);
      setUserData(data);
      setStatus('success');
    } catch (error) {
      handleError(error.response.data.msg, error.response.status);
    }
  }, []);

  useEffect(() => {
    if (id === loggedIn) {
      setIsSameUser(true);
    }
  }, [id, loggedIn]);

  const conditionalInfos = (field, name, icon) => {
    if (field) {
      return (
        <p style={{ paddingTop: '1em' }}>
          {' '}
          <i className='material-icons'>{icon}</i> {field}
        </p>
      );
    } else if (isSameUser) {
      return (
        <p style={{ paddingTop: '1em' }}>
          {' '}
          <i className='material-icons'>{icon}</i>{' '}
          <a href={`/editProfile`}>Add a {name}</a>
        </p>
      );
    } else {
      return null;
    }
  };

  if (status === 'loading') {
    return (
      <div className='page-container'>
        <div className='progress'>
          <div className='indeterminate'></div>
        </div>
      </div>
    );
  } else {
    return (
      <div className='page-container container'>
        <div className='row'>
          <div className='col s12 l8 offset-l2'>
            <h1
              style={{
                fontSize: '1.8em',
                marginTop: '2em',
                marginBottom: '0',
              }}
            >
              {userData.name.toUpperCase()}
            </h1>
          </div>
          <div className='col s12 l8 offset-l2'>
            <p style={{ paddingTop: '1em' }}>
              <i className='material-icons'>verified_user</i>
              Reporting places since (
              {new Date(userData.createdAt).toLocaleDateString('en-gb')})
            </p>
            <p style={{ paddingTop: '1em' }}>
              <i className='material-icons'>star</i>
              {userData.points} points
            </p>

            {conditionalInfos(userData.description, 'description', 'portrait')}

            {conditionalInfos(userData.location, 'location', 'place')}
          </div>
          <MyPlaces />
        </div>
        {isSameUser ? <EditProfileButton /> : null}
      </div>
    );
  }
};

export default ProfileScreen;
