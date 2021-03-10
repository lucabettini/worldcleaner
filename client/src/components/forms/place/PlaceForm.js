import React, { useState, useRef, useEffect } from 'react';
import imageCompression from 'browser-image-compression';

import M from 'materialize-css/dist/js/materialize.min.js';

import DeletePlaceButton from '../../buttons/place/DeletePlaceButton';
import useError from '../../../hooks/useError';

const PlaceForm = ({
  nameValue,
  descriptionValue,
  formName,
  onSubmit,
  deleteButton,
}) => {
  useEffect(() => {
    M.updateTextFields();
  }, []);

  const handleError = useError();

  const nameRef = useRef(null);
  const descriptionRef = useRef(null);
  const fileRef = useRef(null);

  const [coordinates, setCoordinates] = useState(null);
  const [geolocation, setGeolocation] = useState(false);
  const [loading, setLoading] = useState(false);

  // Geolocation API
  const geolocate = () => {
    if ('geolocation' in navigator) {
      setGeolocation('loading');
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCoordinates({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });

          setGeolocation('active');
        },
        // Error callback
        () => {
          handleError('Location not available, try again');
          setGeolocation(false);
        },
        // Options
        {
          enableHighAccuracy: true,
          timeout: 7000,
        }
      );
    } else {
      handleError('Location not available, make sure the GPS is on');
      setGeolocation(false);
    }
  };

  const buttonText =
    geolocation === 'active'
      ? ' LOCATION ADDED'
      : `${formName.toUpperCase()} YOUR LOCATION`;

  const handleSubmit = async (e) => {
    e.preventDefault();

    const imageFile = fileRef.current.files[0];

    if (!imageFile) {
      onSubmit({
        name: nameRef.current.value,
        description: descriptionRef.current.value,
        file: undefined,
        coordinates: coordinates ?? undefined,
      });
    } else {
      try {
        setLoading(true);

        // Compress image
        const compressedFileBlob = await imageCompression(
          fileRef.current.files[0],
          {
            maxSizeMB: 1,
          }
        );

        compressedFileBlob.lastModifiedDate = new Date();
        const compressedFile = await new File(
          [compressedFileBlob],
          imageFile.name,
          { type: imageFile.type, lastModified: Date.now() }
        );

        // Send form data to parent
        setLoading(false);
        await onSubmit({
          name: nameRef.current.value,
          description: descriptionRef.current.value,
          file: compressedFile,
          coordinates: coordinates,
        });
      } catch (error) {
        setLoading(false);
        handleError('There was a problem uploading the image', null, error);
      }
    }
  };

  return (
    <div className='page-container form'>
      <form onSubmit={handleSubmit} encType='multipart/form-data'>
        <div className='input-field'>
          <input
            name='name'
            id='first_name'
            type='text'
            ref={nameRef}
            defaultValue={nameValue ?? null}
          />
          <label htmlFor='name'>Brief description</label>
        </div>
        <div className='input-field'>
          <textarea
            name='description'
            id='description'
            type='text'
            className='materialize-textarea'
            ref={descriptionRef}
            defaultValue={descriptionValue}
          />
          <label htmlFor='description'>Additional infos (optional)</label>
        </div>
        {}
        <div>
          <button
            className='waves-effect waves-light btn primary-bg'
            onClick={geolocate}
            type='button'
          >
            <i className='material-icons'>gps_fixed</i>
            {buttonText}
          </button>
        </div>

        {geolocation === 'loading' ? (
          <div className='progress'>
            <div className='indeterminate'></div>
          </div>
        ) : null}

        <div className='file-field input-field'>
          <div className='btn primary-bg'>
            <span>File</span>
            <input type='file' ref={fileRef} />
          </div>
          <div className='file-path-wrapper'>
            <input className='file-path validate' type='text' />
          </div>
        </div>

        <button
          className='waves-effect waves-light btn primary-bg'
          type='submit'
        >
          {loading ? (
            <div className='progress'>
              <div className='indeterminate'></div>
            </div>
          ) : (
            `${formName.toUpperCase()} PLACE`
          )}
        </button>
        {deleteButton ? <DeletePlaceButton /> : null}
      </form>
    </div>
  );
};

export default PlaceForm;
