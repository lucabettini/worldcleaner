import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import M from 'materialize-css/dist/js/materialize.min.js';

import {
  fetchPlaces,
  selectSortedPlaces,
  selectStatus,
} from '../../../redux/placesSlice';

const MyPlaces = () => {
  const dispatch = useDispatch();
  const id = useParams().id;

  const status = useSelector(selectStatus);
  const sortedPlaces = useSelector(selectSortedPlaces);

  useEffect(() => {
    dispatch(fetchPlaces());
  }, []);

  useEffect(() => {
    const elem = document.querySelectorAll('.collapsible');
    M.Collapsible.init(elem);
  });

  const cookies = document.cookie;
  console.log(cookies);

  const reportedPlaces = () => {
    const reported = sortedPlaces.filter((place) => place.user === id);
    const items = reported.map((place) => {
      return (
        <a
          className='hover-collection collection-item light-bg dark-text'
          href={`/#/places/${place._id}`}
          key={place._id}
        >
          {place.name.toUpperCase()}
          <span className='secondary-content dark-text'>
            {new Date(place.createdAt).toLocaleDateString('en-gb')}
          </span>
        </a>
      );
    });
    return items;
  };

  const cleanedPlaces = () => {
    const reported = sortedPlaces.filter((place) => place.cleaned.user === id);
    const items = reported.map((place) => {
      return (
        <a
          className='hover-collection collection-item light-bg dark-text'
          href={`/#/places/${place._id}`}
          key={place._id}
        >
          {place.name.toUpperCase()}
          <span className='secondary-content dark-text'>
            {new Date(place.createdAt).toLocaleDateString('en-gb')}
          </span>
        </a>
      );
    });
    return items;
  };

  if (status !== 'succeeded') {
    return (
      <div className='progress'>
        <div className='indeterminate'></div>
      </div>
    );
  } else {
    return (
      <div className='col s12 l8 offset-l2'>
        <ul className='collapsible popout' style={{ marginTop: '3em' }}>
          <li className='active'>
            <div className='collapsible-header light-bg'>
              <span style={{ display: 'block', margin: '0 auto' }}>
                REPORTED
              </span>
            </div>
            <div className='collapsible-body'>
              <ul className='collection'>{reportedPlaces()}</ul>
            </div>
          </li>
        </ul>
        <ul className='collapsible popout' style={{ marginTop: '3em' }}>
          <li className='active'>
            <div className='collapsible-header light-bg'>
              <span style={{ display: 'block', margin: '0 auto' }}>
                CLEANED
              </span>
            </div>
            <div className='collapsible-body'>
              <ul className='collection'>{cleanedPlaces()}</ul>
            </div>
          </li>
        </ul>
      </div>
    );
  }
};

export default MyPlaces;
