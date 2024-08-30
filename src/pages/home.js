import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import './home.css';

const Home = () => {
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000); 

    return () => clearInterval(timer); 
  }, []);

  return (
    <div className="home-container">
      <h1>Bienvenue sur Mon Projet React</h1>
      <div className="date-time">
        <p className="date">{format(currentDateTime, 'dd/MM/yyyy')}</p>
        <p className="time">{format(currentDateTime, 'HH:mm:ss')}</p>
      </div>
    </div>
  );
};

export default Home;
