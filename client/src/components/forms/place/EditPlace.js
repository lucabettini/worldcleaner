import React, { useState, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import axios from 'axios';
import PlaceForm from './PlaceForm';
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
    if (obj.name) {
      data.append('name', obj.name);
    }
    if (obj.description) {
      data.append('description', obj.description);
    }
    if (obj.coordinates) {
      data.append('latitude', obj.coordinates.latitude);
      data.append('longitude', obj.coordinates.longitude);
    }
    if (obj.file) {
      data.append('file', obj.file);
    }

    try {
      await axios.patch(`/api/places/${id}`, data, {
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
      <PlaceForm
        nameValue={place.name}
        descriptionValue={place.description ?? ''}
        formName={'Edit'}
        onSubmit={onSubmit}
        deleteButton={true}
      />
    );
  }
};

export default EditPlace;
