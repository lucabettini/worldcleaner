import React from 'react';

const EditCleaningButton = ({ id }) => {
  return (
    <a
      href={`/clean/edit/${id}`}
      style={{ display: 'block', width: '100%' }}
      className='waves-effect waves-light btn righteous dark-bg light-text'
    >
      {' '}
      <i className='large material-icons light-text'>edit</i> EDIT CLEANING
    </a>
  );
};

export default EditCleaningButton;
