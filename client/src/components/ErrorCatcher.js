import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router';

import { selectError } from '../redux/placesSlice';

// This components listens to changes in the error
// property of global state and redirects to errorScreen
// if that is set to true. Renders everything else otherwise.

const ErrorCatcher = (props) => {
  const error = useSelector(selectError);
  const history = useHistory();

  useEffect(() => {
    if (error) {
      history.push('/error');
    }
  });

  return props.children;
};

export default ErrorCatcher;
