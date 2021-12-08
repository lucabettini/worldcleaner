import React from 'react';

const Footer = () => {
  return (
    <footer
      className='page-footer primary-bg z-depth-1'
      style={{ paddingTop: '5px', height: '20px' }}
    >
      <div className='center-align'>
        <p style={{ fontSize: '0.8em' }} className='dark-text'>
          Created by{' '}
          <a
            href='https://lucabettini.com'
            target='_blank'
            rel='noopener noreferrer'
            className='light-text'
          >
            Luca Bettini
          </a>{' '}
          | Code and credits{' '}
          <a
            href='https://github.com/lucabettini/worldcleaner'
            target='_blank'
            rel='noopener noreferrer'
            className='light-text'
          >
            here
          </a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
