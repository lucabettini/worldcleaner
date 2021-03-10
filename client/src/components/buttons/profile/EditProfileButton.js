import React from 'react';

const EditProfileButton = () => {
  return (
    <div
      className='fixed-action-button'
      style={{ position: 'fixed', bottom: '25px', right: '25px' }}
    >
      <a
        className=' btn-floating waves-effect waves-light btn-large righteous dark-bg light-text grande'
        href={`/#/editProfile`}
      >
        <i className='large material-icons light-text'>edit</i>
      </a>
    </div>
  );
};

export default EditProfileButton;
