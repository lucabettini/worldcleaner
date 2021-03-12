import axios from 'axios';
import { useState } from 'react';
import { useHistory } from 'react-router';

const useCredentials = () => {
  const history = useHistory();
  const [user, setState] = useState(sessionStorage.getItem('userId'));

  const setUser = async (id) => {
    if (id === 'logout') {
      sessionStorage.clear();
      setState(null);

      try {
        await axios.post('/api/auth/logout', null, {
          withCredentials: true,
        });
      } catch (error) {
        history.push('/error');
      }
    } else {
      sessionStorage.setItem('userId', id);
      setState(id);
    }
  };

  return [user, setUser];
};

export default useCredentials;
