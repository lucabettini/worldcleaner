import React, { useState, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import axios from 'axios';
import CleaningForm from './CleaningForm';
import useError from '../../../hooks/useError';

const EditPlace = () => {
  const id = useParams().id;
  const history = useHistory();
  const handleError = useError();

  const [place, setPlace] = useState({});
  const [status, setStatus] = useState('loading');

  useEffect(async () => {
    try {
      const { data } = await axios.get(`/api/places/${id}`);
      setPlace(data);
      setStatus('succeeded');
    } catch (error) {
      handleError(error.response.data.msg, error.response.status);
      setStatus('failed');
    }
  }, []);

  const onSubmit = async (obj) => {
    const data = new FormData();
    if (obj.description) {
      data.append('description', obj.description);
    }
    if (obj.file) {
      data.append('file', obj.file);
    }

    try {
      await axios.patch(`/api/clean/${id}`, data, {
        withCredentials: true,
      });
      history.push(`/places/${id}`);
    } catch (error) {
      handleError(error.response.data.msg, error.response.status);
    }
  };

  if (status !== 'succeeded') {
    return (
      <div className='page-container'>
        <div className='progress'>
          <div className='indeterminate'></div>
        </div>
      </div>
    );
  } else {
    return (
      <CleaningForm
        descriptionValue={place.cleaned.description ?? ''}
        formName={'Edit'}
        onSubmit={onSubmit}
        deleteButton={true}
      />
    );
  }
};

export default EditPlace;
