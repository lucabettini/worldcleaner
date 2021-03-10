import React, { useRef, useEffect, useState } from 'react';
import imageCompression from 'browser-image-compression';

import M from 'materialize-css/dist/js/materialize.min.js';

import DeleteCleaningButton from '../../buttons/cleaning/DeleteCleaningButton';
import useError from '../../../hooks/useError';

const CleaningForm = ({
  descriptionValue,
  formName,
  onSubmit,
  deleteButton,
}) => {
  useEffect(() => {
    M.updateTextFields();
  }, []);

  const handleError = useError();

  const descriptionRef = useRef(null);
  const fileRef = useRef(null);

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const imageFile = fileRef.current.files[0];

    if (!imageFile) {
      onSubmit({
        description: descriptionRef.current.value,
      });
    } else {
      try {
        setLoading(true);

        // Check image type
        console.log(imageFile.type);
        console.log(typeof imageFile.type);
        if (imageFile.type !== 'image/jpeg' && imageFile.type !== 'image/png') {
          throw new Error();
        }

        // Compress image
        const compressedFileBlob = await imageCompression(imageFile, {
          maxSizeMB: 1,
        });

        compressedFileBlob.lastModifiedDate = new Date();
        const compressedFile = await new File(
          [compressedFileBlob],
          imageFile.name,
          { type: imageFile.type, lastModified: Date.now() }
        );

        // Send form data to parent
        setLoading(false);
        await onSubmit({
          description: descriptionRef.current.value,
          file: compressedFile,
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
            `${formName.toUpperCase()} CLEANING`
          )}
        </button>
        {deleteButton ? <DeleteCleaningButton /> : null}
      </form>
    </div>
  );
};

export default CleaningForm;
