import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectStatus,
  selectSortedPlaces,
  fetchPlaces,
} from '../../redux/placesSlice';

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

  const { slug } = useParams();
  useEffect(() => {
    setChecked({
      ...checked,
      [slug]: true,
    });
  }, [slug]);

  const onCheck = (e) => {
    // This function makes all others options false
    // when one is changed (either selected or deselected)
    // thus providing us a radio-like behaviour.
    const newCheck = Object.assign({}, checked);
    Object.keys(newCheck).map((key) => {
      if (key !== e.target.name) {
        newCheck[key] = false;
        document.getElementById(key).checked = false;
      } else {
        newCheck[e.target.name] = !checked[e.target.name];
      }
    });
    setChecked(newCheck);
  };

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
        <form
          action='#'
          style={{
            display: 'flex',
            justifyContent: 'space-around',
            width: '60%',
            margin: '2em auto 0 auto',
          }}
        >
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
