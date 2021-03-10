import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import useStorage from '../hooks/useStorage';
import useError from '../hooks/useError';

const Header = () => {
  const [loggedIn, setLoggedIn] = useStorage();
  const handleError = useError();
  const [name, setName] = useState(null);
  const history = useHistory();

  useEffect(async () => {
    if (loggedIn) {
      try {
        const { data } = await axios.get(`/api/users/${loggedIn}`);
        setName(data.name);
      } catch (error) {
        handleError(error.response.data.msg, error.response.status);
      }
    }
  }, [loggedIn]);

  const onLogout = () => {
    setLoggedIn('logout');
    history.push('/');
  };

  const navButtons = name ? (
    <>
      <li>
        <a href={`/users/${loggedIn}`} className='light-text'>
          {name.toUpperCase()}
        </a>
      </li>
      <li>
        <a href='#' onClick={onLogout}>
          <i className='material-icons'>exit_to_app</i>
        </a>
      </li>
    </>
  ) : (
    <>
      <li>
        <a href='/register' className='light-text'>
          JOIN US
        </a>
      </li>
    </>
  );

  return (
    <header>
      <nav>
        <div className='nav-wrapper righteous primary-bg'>
          <div className='container'>
            <a href='/' className='light-text' style={{ fontSize: '1.3em' }}>
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
