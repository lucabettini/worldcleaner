import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { throwError } from '../redux/placesSlice';

import M from 'materialize-css/dist/js/materialize.min.js';

import useCredentials from './useCredentials';

// This hooks sorts all the errors thrown inside components or
// by axios if a request to the server fails. Either displays
// a toast to the user (and additional infos in console if in
// development mode) or dispatches the thrownError function to
// the reducer, changing the global state.
// The ErrorCather component listens to this kind of state changes,
// redirecting the user immediately to the ErrorScreen component,
// where the state is resetted to its initial state.

const useError = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const [loggedIn, setLoggedIn] = useCredentials();

  const handleError = (message, statusCode, error) => {
    if (!statusCode) {
      // ERRORS FROM COMPONENTS
      if (error && process.env.NODE_ENV === 'development') {
        console.error(error);
      }
      M.toast({ html: message });
    } else {
      // ERRORS FROM SERVER (FAILED AXIOS REQUESTS)
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
            // Session cookie has expired
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
            // Failed attempt to change password while logged in.
            // User is logged out for pre-emptive security.
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
