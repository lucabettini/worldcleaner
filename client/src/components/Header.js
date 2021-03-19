import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';

import useCredentials from '../hooks/useCredentials';
import useError from '../hooks/useError';

// PAGE STRUCTURE:
// As soon as this components renders, it checks if there
// is an ID (or the string 'admin') saved on sessionStorage.
// If not, displays a register link. When an ID is available,
// the component renders again, adding a link to Profile or
// admin Dashboard and the logout button.

// API REQUESTS
// @get   /api/users/:id

const Header = () => {
  const [loggedIn, setLoggedIn] = useCredentials();
  const handleError = useError();
  const [name, setName] = useState(null);
  const history = useHistory();

  useEffect(async () => {
    if (loggedIn && loggedIn !== 'admin') {
      try {
        // Ask server the username of logged in user
        const { data } = await axios.get(`/api/users/${loggedIn}`);
        setName(data.name);
      } catch (error) {
        handleError(error.response.data.msg, error.response.status);
      }
    } else if (loggedIn === 'admin') {
      setName('admin');
    }
  }, [loggedIn]);

  const onLogout = () => {
    setLoggedIn('logout');
    history.push('/');
  };

  const link = (id) => {
    if (id === 'admin') {
      return `/dashboard`; // Admin dashboard
    } else {
      return `/users/${id}`; // User profile screen
    }
  };

  const navButtons = name ? (
    <>
      <li>
        <a href={link(loggedIn)} className='light-text nav-links'>
          {name.toUpperCase()}
        </a>
      </li>
      <li>
        <a href='#' onClick={onLogout} className='nav-links'>
          <i className='material-icons'>exit_to_app</i>
        </a>
      </li>
    </>
  ) : (
    <>
      <li>
        <a href='/register' className='light-text nav-links'>
          JOIN US
        </a>
      </li>
    </>
  );

  return (
    <header>
      <nav>
        <div className='nav-wrapper righteous primary-bg'>
          <div className='container nav-container'>
            <a href='/' className='light-text nav-logo nav-links'>
              WORLD CLEANER
            </a>
            <ul className='right light-text'>{navButtons}</ul>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
