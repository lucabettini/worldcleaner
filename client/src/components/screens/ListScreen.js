import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import {
  selectStatus,
  selectSortedPlaces,
  fetchPlaces,
} from '../../redux/placesSlice';

// PAGE STRUCTURE:
// - Inline checkbox (manipulated to behave like a radio input)
// - Collections ALL / POLLUTED / CLEANED (max 30 values)
//   with links to individual places

// API REQUESTS
// @get   /api/places/    (through Redux Thunk)

const ListScreen = () => {
  const dispatch = useDispatch();

  const status = useSelector(selectStatus);
  const places = useSelector(selectSortedPlaces);

  useEffect(() => {
    dispatch(fetchPlaces());
  }, [dispatch]);

  const [checked, setChecked] = useState({
    all: false,
    polluted: false,
    cleaned: false,
  });

  // An initial value, either cleaned or polluted, is set,
  // depending on which link the user has followed to came here
  const { slug } = useParams();
  useEffect(() => {
    setChecked({
      ...checked,
      [slug]: true,
    });
  }, [slug]);

  // This function makes all others options false
  // when one is changed (either selected or deselected)
  // thus providing a radio-like behaviour, but using
  // materialize.css styling for checkbox inputs.
  const onCheck = (e) => {
    // Create a new object, cannot modify state directly
    const newCheck = Object.assign({}, checked);
    Object.keys(newCheck).map((key) => {
      if (key !== e.target.name) {
        newCheck[key] = false;
        // Change checked status on HTML - otherwise the other
        // options stay checked
        document.getElementById(key).checked = false;
      } else {
        newCheck[e.target.name] = !checked[e.target.name];
      }
    });
    // Change state with the new object
    setChecked(newCheck);
  };

  // This function changes the rendering when some option is chosen
  const selectPlaces = () => {
    if (checked.all) {
      return places;
    } else if (checked.cleaned) {
      return places.filter((place) => place.cleaned.isCleaned);
    } else if (checked.polluted) {
      return places.filter((place) => !place.cleaned.isCleaned);
    } else {
      return undefined;
    }
  };

  const selectedPlaces = selectPlaces();

  if (status === 'succeeded') {
    return (
      <div className='page-container container'>
        <form action='#' className='list-form'>
          <label htmlFor='all'>
            <input
              type='checkbox'
              id='all'
              name='all'
              onChange={onCheck}
              defaultChecked={checked.all}
            />
            <span className='dark-text'>All</span>
          </label>
          <label htmlFor='polluted'>
            <input
              type='checkbox'
              id='polluted'
              name='polluted'
              onChange={onCheck}
              defaultChecked={checked.polluted}
            />
            <span className='dark-text'>Polluted</span>
          </label>
          <label htmlFor='cleaned'>
            <input
              type='checkbox'
              id='cleaned'
              name='cleaned'
              onChange={onCheck}
              defaultChecked={checked.cleaned}
            />
            <span className='dark-text'>Cleaned</span>
          </label>
        </form>
        {selectedPlaces ? (
          <div
            className='collection light-bg z-depth-1'
            style={{ marginTop: '3em' }}
          >
            {selectedPlaces.slice(0, 30).map((place) => {
              return (
                <a
                  className='collection-item dark-text light-bg'
                  href={`/places/${place._id}`}
                  key={place._id}
                >
                  {place.name.toUpperCase()}
                  <span className='secondary-content dark-text'>
                    {place.cleaned.isCleaned ? (
                      <i className='material-icons  primary-text'>eco</i>
                    ) : null}{' '}
                    {new Date(place.createdAt).toLocaleDateString('en-gb')}
                  </span>
                </a>
              );
            })}
          </div>
        ) : null}
      </div>
    );
  } else {
    return null;
  }
};

export default ListScreen;
