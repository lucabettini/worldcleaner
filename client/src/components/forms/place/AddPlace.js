import React from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';

import PlaceForm from './PlaceForm';
import useError from '../../../hooks/useError';

const AddPlace = () => {
  const history = useHistory();
  const handleError = useError();

  const onSubmit = async (obj) => {
    // Validation
    if (!obj.name) {
      handleError('Name is required');
    } else if (!obj.coordinates) {
      handleError('Location is required');
    } else if (!obj.file) {
      handleError('Image is required');
    } else {
      // Prepare request
      const data = new FormData();
      data.append('name', obj.name);
      if (obj.description) {
        data.append('description', obj.description);
      }
      data.append('latitude', obj.coordinates.latitude);
      data.append('longitude', obj.coordinates.longitude);
      data.append('file', obj.file);

      try {
        const res = await axios.post('/api/places', data, {
          withCredentials: true,
        });
        history.push(`/places/${res.data.place}`);
      } catch (error) {
        handleError(error.response.data.msg, error.response.status);
      }
    }
  };

  return (
    <PlaceForm
      descriptionValue={undefined}
      formName={'Add'}
      onSubmit={onSubmit}
    />
  );
};

export default AddPlace;
