import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import LiveMap from './Components/LiveMap';
import { BaseUrl } from './Components/BaseUrl';

const socket = io(`${BaseUrl}`); // Connect to the backend

const App = () => {
  const [criminals, setCriminals] = useState([]);
  const [ipAddress, setIpAddress] = useState(''); // State to store IP address
  const [location, setLocation] = useState({ latitude: 0, longitude: 0 }); // State to store location

  useEffect(() => {
    // Fetch IP address dynamically
    const fetchIpAddress = async () => {
      try {
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        setIpAddress(data.ip); // Set the IP address in state
      } catch (error) {
        console.error('Error fetching IP address:', error);
      }
    };

    fetchIpAddress();
  }, []); // Empty dependency array to fetch IP once on component mount

  useEffect(() => {
    // Listen for real-time updates from the server
    socket.on('locationUpdated', (updatedCriminal) => {
      setCriminals((prevCriminals) =>
        prevCriminals.map((criminal) =>
          criminal.ip === updatedCriminal.ip
            ? { ...criminal, latitude: updatedCriminal.latitude, longitude: updatedCriminal.longitude }
            : criminal
        )
      );
    });

    // Request initial data from the server for existing criminals
    socket.emit('requestInitialData');

    // Listen for the initial data response
    socket.on('initialData', (data) => {
      setCriminals(data);
    });

    // Cleanup the socket connection on component unmount
    return () => {
      socket.off('locationUpdated');
      socket.off('initialData');
    };
  }, []);

  useEffect(() => {
    // Function to update the location at intervals
    const updateLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ latitude, longitude });

          // Emit the location data to the server
          if (ipAddress) {
            socket.emit('updateLocation', {
              ip: ipAddress,
              latitude,
              longitude,
            });
          }
        }, (error) => {
          console.error('Error getting location:', error);
        }, {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0,
        });
      } else {
        console.error('Geolocation is not supported by this browser.');
      }
    };

    // Update location every 2 seconds
    const intervalId = setInterval(updateLocation, 2000);

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, [ipAddress]); // Dependency array includes ipAddress

  return (
    <>
      <div>
        <LiveMap criminals={criminals} />
      </div>
      {/* <PatterLock/> */}
    </>
  );
};

export default App;
