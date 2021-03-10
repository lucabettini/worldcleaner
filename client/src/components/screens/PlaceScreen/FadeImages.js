import React from 'react';
import { Fade } from 'react-slideshow-image';

const FadeImages = ({ pollutedImg, cleanedImg }) => {
  const properties = {
    arrows: false,
    duration: 3000,
  };

  return (
    <Fade {...properties}>
      <div className='fade'>
        <img
          src={`/images/${pollutedImg}`}
          alt='First image'
          className='z-depth-2 place-img'
        />
      </div>
      {cleanedImg ? (
        <div className='fade'>
          <img
            src={`/images/${cleanedImg}`}
            alt='Second image'
            className='z-depth-2 place-img'
          />
        </div>
      ) : null}
    </Fade>
  );
};

export default FadeImages;
