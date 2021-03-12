import axios from 'axios';
import React, { useState, useEffect } from 'react';
import useError from '../../../hooks/useError';

const Leaderboard = () => {
  const handleError = useError();
  const [status, setStatus] = useState('loading');
  const [users, setUsers] = useState([]);

  useEffect(async () => {
    try {
      const { data } = await axios.get('/api/users');
      setUsers(data);
      setStatus('success');
    } catch (error) {
      handleError(error.response.data.msg, error.response.status);
    }
  }, []);

  const sortedUsers = () => {
    const usersArr = [...users];
    // find Admin and remove it from the list
    const sortedByPoints = usersArr
      .sort((a, b) => (a.points > b.points ? -1 : 1))
      .slice(0, 10);

    const listItems = sortedByPoints.map((user, index) => {
      return (
        <a
          className='hover-collection collection-item light-bg dark-text'
          href={`/#/users/${user._id}`}
          key={user._id}
        >
          {`${index + 1}. ${user.name.toUpperCase()}`}
          <span className='secondary-content dark-text'>
            {user.points} <i className='material-icons '>star</i>{' '}
          </span>
        </a>
      );
    });

    return listItems;
  };

  return (
    <ul className='collapsible popout' style={{ marginTop: '3em' }}>
      <li className='active'>
        <div className='collapsible-header light-bg righteous'>
          <span style={{ display: 'block', margin: '0 auto' }}>BEST USERS</span>
        </div>
        <div className='collapsible-body'>
          {status === 'success' ? (
            <ul className='collection'>{sortedUsers()}</ul>
          ) : (
            <div className='progress'>
              <div className='indeterminate'></div>
            </div>
          )}
        </div>
      </li>
    </ul>
  );
};

export default Leaderboard;
