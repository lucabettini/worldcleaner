import React from 'react';
import { useHistory, useParams } from 'react-router-dom';
import axios from 'axios';

import CleaningForm from './CleaningForm';
import useError from '../../../hooks/useError';

const AddCleaning = () => {
  const id = useParams().id;
  const history = useHistory();
  const handleError = useError();

  const onSubmit = async (obj) => {
    if (!obj.file) {
      handleError('Image is required');
    } else {
      // Prepare request
      const data = new FormData();
      if (obj.description) {
        data.append('description', obj.description);
      }
      data.append('file', obj.file);

      try {
        await axios.post(`/api/clean/${id}`, data, {
          withCredentials: true,
        });

        history.push(`/places/${id}`);
      } catch (error) {
        handleError(error.response.data.msg, error.response.status);
      }
    }
  };

  return (
    <CleaningForm
      descriptionValue={undefined}
      formName={'Add'}
      onSubmit={onSubmit}
    />
  );
};

export default AddCleaning;
