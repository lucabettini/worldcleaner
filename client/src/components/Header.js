import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import useCredentials from '../hooks/useCredentials';
import useError from '../hooks/useError';

const Header = () => {
  const [loggedIn, setLoggedIn] = useCredentials();
  const handleError = useError();
  const [name, setName] = useState(null);
  const history = useHistory();

  useEffect(async () => {
    if (loggedIn && loggedIn !== 'admin') {
      try {
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
      return `/#/dashboard`;
    } else {
      return `/#/users/${id}`;
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
        <a href='/#/register' className='light-text nav-links'>
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
            <a href='/#/' className='light-text nav-logo nav-links'>
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
