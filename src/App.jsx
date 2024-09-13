import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import LiveMap from './Components/LiveMap';
// import PatterLock from './Components/PatterLock';

const socket = io('http://localhost:3000'); // Connect to the backend

const App = () => {
  const [criminals, setCriminals] = useState([]);

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

  // Emit location update to the server (you could trigger this in an interval or via user action)
  const updateLocation = (ip, latitude, longitude) => {
    socket.emit('updateLocation', { ip, latitude, longitude });
  };

  return (

    <>   <div>
      {/* <h1>Live Map Tracker for Criminals</h1> */}
      <LiveMap criminals={criminals} />
    
    </div> 
    {/* <PatterLock/> */}
    
    </>
  
  );
};

export default App;
