import React from 'react';
import { useHistory } from 'react-router-dom';
import { MapContainer, Marker, TileLayer } from 'react-leaflet';

import L from 'leaflet';
import trashMarker from '../styles/img/markers/trashcan.png';
import leafMarker from '../styles/img/markers/leaf.png';

const trashIcon = new L.Icon({
  iconUrl: trashMarker,
  iconRetinaUrl: trashMarker,
  iconSize: new L.Point(20, 20),
  iconAnchor: [10, 20],
});

const leafIcon = new L.Icon({
  iconUrl: leafMarker,
  iconRetinaUrl: leafMarker,
  iconSize: new L.Point(20, 20),
  iconAnchor: [10, 20],
});

const Map = ({ places, styling, center, zoom }) => {
  const history = useHistory();

  return (
    <MapContainer
      center={center}
      zoom={zoom}
      scrollWheelZoom={true}
      className={styling}
      zoomControl={false}
    >
      <TileLayer url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png' />
      {places.map((place) => (
        <Marker
          key={place._id}
          position={place.coordinates}
          icon={place.cleaned.isCleaned ? leafIcon : trashIcon}
          eventHandlers={{
            click: () => {
              history.push(`/places/${place._id}`);
            },
          }}
        ></Marker>
      ))}
    </MapContainer>
  );
};

export default Map;
