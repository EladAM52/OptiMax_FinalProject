import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation

const LogoutButton = () => {
  const navigate = useNavigate(); // Initialize useNavigate hook

  const handleLogout = () => {
    fetch('http://localhost:5000/logout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
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
        console.log('User Logout!');
        navigate('/login'); // Use navigate to redirect to login page
      }
    })
    .catch(error => {
      console.error('There has been a problem with your fetch operation:', error);
    });
  };

  return (
    <button onClick={handleLogout} className="logout-button">התנתקות</button>
  );
}

export default LogoutButton;
