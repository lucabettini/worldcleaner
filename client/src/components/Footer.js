import React from 'react';

const Footer = () => {
  return (
    <footer
      className='page-footer primary-bg z-depth-1'
      style={{ paddingTop: '5px', height: '20px' }}
    >
      <div className='center-align'>
        <p style={{ fontSize: '0.8em' }}>
          Created by{' '}
          <a href='https://lucabettini.github.io/' className='dark-text'>
            Luca Bettini
          </a>{' '}
          | Code and credits{' '}
          <a
            href='https://github.com/lucabettini/worldcleaner'
            className='dark-text'
          >
            here
          </a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
