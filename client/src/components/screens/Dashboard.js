import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router';

import useCredentials from '../../hooks/useCredentials';
import useError from '../../hooks/useError';

// PAGE STRUCTURE:
// - Places collection, with links and remove buttons
// - Users collection, with links and remove buttons

// API REQUESTS
// @get     /api/places/
// @get     /api/users/
// @delete  /api/places/:id
// @delete  /api/clean/:id
// @delete  /api/users/:id

const Dashboard = () => {
  const [loggedIn, setLoggedIn] = useCredentials();
  const handleError = useError();

  const history = useHistory();
  const [admin, setAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [places, setPlaces] = useState(null);
  const [users, setUsers] = useState(null);
  const [reload, setReload] = useState(false);

  useEffect(async () => {
    if (!loggedIn || loggedIn !== 'admin') {
      // Redirect users without privileges
      history.push('/');
    } else {
      setAdmin(true);
    }
  }, [loggedIn]);

  // Get data and save them on state, invoked again
  // whenever a place, clean info or user are removed.
  useEffect(async () => {
    try {
      const places = await axios.get('/api/places');
      setPlaces(places.data);
      const users = await axios.get('/api/users');
      setUsers(users.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      handleError(error.response.data.msg, error.response.status);
    }
  }, [reload]);

  const removeItem = async (id, item) => {
    try {
      await axios.delete(`/api/${item}/${id}`);
      // Force page re-rendering with new data
      setReload(!reload);
    } catch (error) {
      handleError(error.response.data.msg, error.response.status);
    }
  };

  const placesContent = () => {
    const getUsername = (id) => {
      const user = users.filter((user) => user._id == id);
      return user[0].name;
    };

    return places.map((place) => {
      return (
        <tr key={place._id}>
          <td>
            <a className='dark-text' href={`/places/${place._id}`}>
              {place.name.toUpperCase()}
            </a>
          </td>
          <td>
            <a className='dark-text' href={`/users/${place.user}`}>
              {getUsername(place.user)}
            </a>
          </td>
          <td className='dark-text'>
            {new Date(place.createdAt).toLocaleDateString('en-gb')}
          </td>
          <td>
            <button
              className='waves-effect waves-light btn red darken-4 light-text'
              style={{ marginRight: '10px' }}
              onClick={() => removeItem(place._id, 'places')}
            >
              REMOVE PLACE
            </button>
            {place.cleaned?.isCleaned ? (
              <button
                className='waves-effect waves-light btn dark-bg light-text'
                onClick={() => removeItem(place._id, 'clean')}
              >
                REMOVE CLEANING
              </button>
            ) : null}
          </td>
        </tr>
      );
    });
  };

  const usersContent = () => {
    return users.map((user) => {
      return (
        <tr key={user._id}>
          <td>
            <a className='dark-text' href={`/users/${user._id}`}>
              {user.name.toUpperCase()}
            </a>
          </td>
          <td className='dark-text'>
            {new Date(user.createdAt).toLocaleDateString('en-gb')}
          </td>
          <td>
            {user.isAdmin ? null : (
              <button
                className='waves-effect waves-light btn red darken-4 light-text'
                style={{ marginRight: '10px' }}
                onClick={() => removeItem(user._id, 'users')}
              >
                REMOVE USER
              </button>
            )}
          </td>
        </tr>
      );
    });
  };

  if (admin && !loading) {
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
              PLACES
            </h1>
            <table className='striped'>
              <thead>
                <tr>
                  <th>Place</th>
                  <th>User</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>{placesContent()}</tbody>
            </table>
            <h1
              style={{
                fontSize: '1.8em',
                marginTop: '2em',
                marginBottom: '0',
              }}
            >
              USERS
            </h1>
            <table className='striped'>
              <thead>
                <tr>
                  <th>User</th>
                  <th>Registration</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>{usersContent()}</tbody>
            </table>
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div className='page-container'>
        <div className='progress'>
          <div className='indeterminate'></div>
        </div>
      </div>
    );
  }
};

export default Dashboard;
