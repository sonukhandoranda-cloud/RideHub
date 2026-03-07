import React from 'react'
import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";



     

const containerStyle = {
  width: "100%",
  height: "500px",
  zIndex: 0
};

const center = {
  lat: 28.6139,
  lng: 77.2090
};

const icon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

const LiveTracking = () => {

  const [currentPosition, setCurrentPosition] = useState(center);

  useEffect(() => {

    const updatePosition = () => {

  navigator.geolocation.getCurrentPosition((position) => {

    const { latitude, longitude } = position.coords;

    console.log("Latitude:", latitude, "Longitude:", longitude); // add here

    setCurrentPosition({
      lat: latitude,
      lng: longitude
    });

  });

};
    // initial position
    updatePosition();

    // update every 10 seconds
    const intervalId = setInterval(updatePosition, 10000);

    return () => clearInterval(intervalId);

  }, []);

  return (
    <MapContainer
  key={`${currentPosition.lat}-${currentPosition.lng}`}
  center={[currentPosition.lat, currentPosition.lng]}
  zoom={15}
  style={containerStyle}
>

  <TileLayer
    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
  />

  <Marker
    position={[currentPosition.lat, currentPosition.lng]}
    icon={icon}
  >
    <Popup>
      Live Location
    </Popup>
  </Marker>

</MapContainer>
  );
};



export default LiveTracking
