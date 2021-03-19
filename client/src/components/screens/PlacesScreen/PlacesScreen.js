import React, { useEffect } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import {
  fetchPlaces,
  selectPlaces,
  selectStatus,
} from '../../../redux/placesSlice';

import M from 'materialize-css/dist/js/materialize.min.js';

import Map from '../../Map';
import AddPlaceButton from '../../buttons/place/AddPlaceButton';
import Leaderboard from './Leaderboard';

// PAGE STRUCTURE:
// - Map with all places and links to each one of them
// - Place count with link to ListScreen component
// - Instructions on adding places
// - Add place button
// - Instructions on adding cleaning
// - Collapsible Leaderboard component

// API REQUESTS
// @get     /api/places/  (through Redux thunk)
// @get     /api/users/   (through Leaderboard component)

const flexContainer = {
  display: 'flex',
  justifyContent: 'space-between',
};

const PlacesScreen = () => {
  const dispatch = useDispatch();

  const status = useSelector(selectStatus);
  const places = useSelector(selectPlaces);

  useEffect(() => {
    dispatch(fetchPlaces());
  }, [dispatch]);

  useEffect(() => {
    const elem = document.querySelectorAll('.collapsible');
    M.Collapsible.init(elem);
  });

  const numOfCleanedPlaces = places.filter(
    (place) => place.cleaned.isCleaned === true
  ).length;

  if (status !== 'succeeded') {
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
        <div className='places-wrapper'>
          {/* MAP */}
          <div className='places-map-container'>
            <Map
              places={places}
              styling={'z-depth-2 places-map circle'}
              center={[49.28, 12.21]}
              zoom={1.5}
            />{' '}
          </div>
          <div className='places-info-container'>
            {/* PLACES COUNT */}
            <div style={flexContainer}>
              <div className='center-align'>
                <a
                  href='/places/list/all'
                  className='dark-text center-align'
                  style={{ fontSize: '4em', marginBottom: '5px' }}
                >
                  {places.length}
                  <p className='place-number-description righteous'>REPORTED</p>
                </a>
              </div>
              <div className='center-align'>
                <a
                  href='/places/list/cleaned'
                  className='primary-text center-align'
                  style={{ fontSize: '4em', marginBottom: '5px' }}
                >
                  {numOfCleanedPlaces}
                  <p className='place-number-description primary-text righteous'>
                    CLEANED
                  </p>
                </a>
              </div>
            </div>
            {/* INSTRUCTIONS AND BUTTON */}
            <div className='row' style={{ display: 'flex' }}>
              <div style={{ marginTop: '1em' }}>
                <p className='places-instructions'>
                  Find a polluted place, take a picture and use the button below
                  to upload it. You will get 10 special internet points!
                </p>
              </div>
            </div>
            <div
              className='row'
              style={{ display: 'flex', justifyContent: 'center' }}
            >
              <AddPlaceButton />
            </div>
            <div
              className='row'
              style={{ display: 'flex', justifyContent: 'center' }}
            >
              <div>
                <p className='places-instructions'>
                  To clean a place, search it on the map (or in{' '}
                  <a href='/places/list/polluted' className='primary-text'>
                    this list
                  </a>
                  ) and click to open it. Then use the leaf button to add
                  another picture. You will get 50 special internet points!
                </p>
              </div>
            </div>
            {/* LEADERBOARD */}
            <div className='row'>
              <Leaderboard />
            </div>
          </div>
        </div>
      </div>
    );
  }
};

export default PlacesScreen;
