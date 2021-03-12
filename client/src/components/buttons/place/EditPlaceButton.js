import React from 'react';

const EditPlaceButton = ({ id }) => {
  return (
    <a
      href={`/places/edit/${id}`}
      style={{ display: 'block', width: '100%' }}
      className='waves-effect waves-light btn righteous dark-bg light-text'
    >
      {' '}
      <i className='large material-icons light-text'>edit</i> EDIT PLACE
    </a>
  );
};

export default EditPlaceButton;
