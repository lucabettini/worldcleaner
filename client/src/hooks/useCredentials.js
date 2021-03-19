import { useState } from 'react';
import { useHistory } from 'react-router';
import axios from 'axios';

const useCredentials = () => {
  const history = useHistory();
  const [user, setState] = useState(sessionStorage.getItem('userId'));

  const setUser = async (id) => {
    if (id !== 'logout') {
      // LOGIN
      // saves user's ID on sessionStorage
      sessionStorage.setItem('userId', id);
      setState(id);
    } else {
      // LOGOUT
      // removes user's ID from sessionStorage
      sessionStorage.clear();
      setState(null);
      // send request to server to remove session cookies,
      // thus blocking next unauthorized requests to server
      try {
        await axios.post('/api/auth/logout', null, {
          withCredentials: true,
        });
      } catch (error) {
        history.push('/error');
      }
    }
  };

  return [user, setUser];
};

export default useCredentials;
