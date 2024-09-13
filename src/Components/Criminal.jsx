import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import { BaseUrl } from './BaseUrl';

// Initialize the Socket.IO client
const socket = io(`${BaseUrl}`); // Ensure this matches your server's address

const Criminal = () => {
  const [location, setLocation] = useState({ latitude: 0, longitude: 0 });
  const [criminalName, setCriminalName] = useState('Criminal'); // You can make this dynamic
  const [error, setError] = useState(null);

  // Function to request and update location
  useEffect(() => {
    const updateLocation = () => {
      // Check if Geolocation is available
      if (navigator.geolocation) {
        // Watch the position and keep tracking the user
        const watchId = navigator.geolocation.watchPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            setLocation({ latitude, longitude });

            // Emit the location data to the server
            socket.emit('updateLocation', {
              name: criminalName,
              latitude,
              longitude,
              ip: '192.168.1.1', // Replace with the actual IP address or dynamically get it
            });

            setError(null); // Reset error if location updates successfully
          },
          (err) => {
            console.error('Error getting location:', err);
            setError(err.message); // Set error state to display message

            // Keep requesting permission if denied
            if (err.code === err.PERMISSION_DENIED) {
              alert('Location access is required. Please enable it.');
            }
          },
          { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 } // Options for high accuracy
        );

        return () => {
          // Clean up the watch position when component unmounts
          navigator.geolocation.clearWatch(watchId);
        };
      } else {
        setError('Geolocation is not supported by this browser.');
      }
    };

    updateLocation();
  }, [criminalName]); // Dependency array

  return (
    <div>
      <h1>Criminal Location Tracker</h1>
      <p>Name: {criminalName}</p>
      <p>Latitude: {location.latitude}</p>
      <p>Longitude: {location.longitude}</p>
      {error && <p>Error: {error}</p>}
    </div>
  );
};

export default Criminal;
