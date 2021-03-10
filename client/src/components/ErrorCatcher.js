import React, { useEffect } from 'react';
import { selectError } from '../redux/placesSlice';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router';

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
