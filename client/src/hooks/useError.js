import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { throwError } from '../redux/placesSlice';

import M from 'materialize-css/dist/js/materialize.min.js';
import useCredentials from './useCredentials';

const useError = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const [loggedIn, setLoggedIn] = useCredentials();

  const handleError = (message, statusCode, error) => {
    if (!statusCode) {
      // Not axios errors
      if (error && process.env.NODE_ENV === 'development') {
        console.error(error);
      }

      M.toast({ html: message });
    } else {
      // Axios errors
      if (process.env.NODE_ENV === 'development') {
        console.log(`${statusCode} - ${message}`);
      }

      switch (statusCode) {
        // Bad request
        case 400:
          if (message === 'Email already exists') {
            M.toast({ html: message });
          } else if (message === 'User not found') {
            M.toast({ html: `Email doesn't exists` });
          } else {
            dispatch(throwError());
          }
          break;

        // Authorization denied
        case 401:
          if (message === 'Token not valid') {
            // If the session cookie is more than 2 hours old
            setLoggedIn('logout');
            history.push('/login');
          } else if (message === 'Invalid password') {
            // Bad password at login
            M.toast({ html: message });
          } else if (message === 'Invalid token') {
            // Token sent with email to reset password has expired
            M.toast({
              html: 'Too much time has passed, try sending another email!',
            });
          } else if (message === 'Old password not valid') {
            // Attempted to change password while loggedin. The user
            // is logged out for pre-emptive security.
            M.toast({
              html: 'Old password not valid, logging out...',
            });
            setTimeout(() => {
              setLoggedIn('logout');
              history.push('/login');
            }, 2000);
          } else {
            setLoggedIn('logout');
            dispatch(throwError());
          }
          break;

        default:
          dispatch(throwError());
      }
    }
  };

  return handleError;
};

export default useError;

// Casi da considerare
// Errori nel caricamento della mappa (imputtanano tutto)
