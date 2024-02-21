import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/manager.css'; // Adjust the path as necessary
import Menu from './Menu';

function Manager() {
  const navigate = useNavigate();
  const [authorized, setAuthorized] = useState(false);
  const [activeMenuItem, setActiveMenuItem] = useState('');
  const username=localStorage.getItem('username');

    const handleLogout = () => {
        fetch('/logout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            if (data.success) {
                window.location.href = '/login';
            }
        })
        .catch(error => {
            console.error('There has been a problem with your fetch operation:', error);
        });
    };
    
    useEffect(() => {
      fetch('/manager')
        .then(response => {
          if (response.ok) {
            return response.json();
          } else {
            throw new Error('Not authorized');
          }
        })
        .then(data => {
          if (data.success) {
            setAuthorized(true);
          } else {
            navigate('/login');
          }
        })
        .catch(error => {
          console.error('Error:', error);
          navigate('/login');
        });
    }, [navigate]);
  
    if (!authorized) {
      return <div>Loading or not authorized...</div>;
    }


    return (
        <div>
      <div className="user-info">
        <button id="logoutbutton" className="logout-button" onClick={handleLogout}>התנתקות</button>
      </div>
      <Menu />
      <div className="welcome-window">
        <h1 id="welcomeMessage">Welcome, {username}</h1>
        <p id="description">Here is a brief description of the dashboard and what you can do here. Feel free to explore the features and functionalities tailored for you.</p>
      </div>
    </div>
  );
}

export default Manager;
