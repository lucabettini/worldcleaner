import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import axios from 'axios';

import useCredentials from '../../../hooks/useCredentials';
import useError from '../../../hooks/useError';

import AddCleaningButton from '../../buttons/cleaning/AddCleaningButton';
import EditPlaceButton from '../../buttons/place/EditPlaceButton';
import EditCleaningButton from '../../buttons/cleaning/EditCleaningButton';
import FadeImages from './FadeImages';
import Map from '../../Map';

const PlaceScreen = () => {
  const [loggedIn, setLoggedIn] = useCredentials();
  const handleError = useError();

  const [place, setPlace] = useState({
    // If we don't include this, place.cleaned is undefined during the first
    // render, before useEffect makes the API call
    // cleaned: '',
  });
  const [status, setStatus] = useState('loading');
  const id = useParams().id;

  useEffect(() => {
    const fetchPlace = async () => {
      try {
        const { data } = await axios.get(`/api/places/${id}`);

        // If the OP's account was deleted, we will get a 404 from
        // the server; if the problem is elsewhere, we catch the error
        // with the outer try/catch block

        try {
          const res = await axios.get(`/api/users/${data.user}`);
          data.username = res.data.name;
        } catch (error) {
          if (error.response.data.msg === 'User not found') {
            data.username = false;
          } else {
            throw new Error(error);
          }
        }

        if (data.cleaned.isCleaned) {
          try {
            const res = await axios.get(`/api/users/${data.cleaned.user}`);
            data.cleaned.username = res.data.name;
          } catch (error) {
            if (error.response.data.msg === 'User not found') {
              data.cleaned.username = false;
            } else {
              throw new Error(error);
            }
          }
        }

        setPlace(data);
        setStatus('succedeed');
      } catch (error) {
        handleError(error.response.data.msg, error.response.status);
        setStatus('failed');
      }
    };

    fetchPlace();
  }, [id]);

  if (status === 'loading') {
    return (
      <div className='page-container'>
        <div className='progress'>
          <div className='indeterminate'></div>
        </div>
      </div>
    );
  } else {
    return (
      <div className='page-container container'>
        <div className='row'>
          <div className='col s12 l8 offset-l2'>
            <h1
              style={{
                fontSize: '1.8em',
                marginTop: '2em',
                marginBottom: '0',
              }}
            >
              {place.name.toUpperCase()}
            </h1>
          </div>
        </div>

        <div className='row'>
          <div className='col s12 l8 offset-l2'>
            <p>
              <i className='material-icons'>delete</i>
              {place.username ? (
                <a href={`/#/users/${place.user}`}>
                  {place.username.toUpperCase()}
                </a>
              ) : null}{' '}
              ({new Date(place.createdAt).toLocaleDateString('en-gb')})
            </p>
            {place.description ? (
              <p style={{ paddingTop: '1em' }}>{place.description}</p>
            ) : null}

            {place.cleaned?.isCleaned ? (
              <p style={{ paddingTop: '1em' }}>
                <i className='material-icons'>eco</i>
                {place.cleaned.username ? (
                  <a href={`/#/users/${place.cleaned.user}`}>
                    {place.cleaned.username.toUpperCase()}
                  </a>
                ) : null}{' '}
                ({new Date(place.cleaned.timestamp).toLocaleDateString('en-gb')}
                )
              </p>
            ) : null}
            {place.cleaned.description ? (
              <p style={{ paddingTop: '1em' }}>{place.cleaned.description}</p>
            ) : null}
          </div>
        </div>
        <div className='row' style={{ marginTop: '1em' }}>
          <div className='col s12 l8 offset-l2'>
            {place.cleaned.isCleaned ? (
              <FadeImages
                pollutedImg={place.imgUrl}
                cleanedImg={place.cleaned.imgUrl}
              />
            ) : (
              <div className='place-img'>
                <img
                  src={place.imgUrl}
                  alt='First image'
                  className='z-depth-2'
                />
              </div>
            )}
          </div>
        </div>
        <div className='row' style={{ marginTop: '1em' }}>
          <div className='col s12 l8 offset-l2'>
            <div>
              <Map
                places={[place]}
                styling={'place-map'}
                zoom={14}
                center={place.coordinates}
              />
            </div>
          </div>
        </div>
        {loggedIn === place.user ? (
          <div className='row' style={{ marginTop: '1em' }}>
            <div className='col s12 l8 offset-l2'>
              <EditPlaceButton id={id} />
            </div>
          </div>
        ) : null}
        {loggedIn === place.cleaned.user ? (
          <div className='row' style={{ marginTop: '1em' }}>
            <div className='col s12 l8 offset-l2'>
              <EditCleaningButton id={id} />
            </div>
          </div>
        ) : null}
        {place.cleaned.isCleaned ? null : <AddCleaningButton id={id} />}
      </div>
    );
  }
};

export default PlaceScreen;
