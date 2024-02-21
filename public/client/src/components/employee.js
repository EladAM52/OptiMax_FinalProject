import React, { useEffect, useState } from 'react';
import logo from '../images/logo.png'; // Adjust the import path according to your project structure
import '../css/employee.css'; // Adjust the path as necessary
import LogoutButton from './logout.js';

function Employee() {
  const [username, setUsername] = useState('');

  useEffect(() => {
    fetch('http://localhost:5000/employee')
      .then(response => response.json())
      .then(data => {
        setUsername(data.username);
      })
      .catch(error => console.error('Error:', error));
  }, []);

  return (
    <div>
      {/* <div className="user-info">
        <button id="logoutbutton" className="logout-button">התנתקות</button>
      </div> */}
      <div>
        <LogoutButton/>
      </div>
      <div className="sidebar">
        <div className="sidebar-logo">
          <img src={logo} alt="Logo" className="logo" />
        </div>
        <ul>
        <li><a href="/personal-details">פרטים אישיים</a></li>
        <li><a href="/task-diary">יומן משימות</a></li>
        <li><a href="/employee-list">רשימת עובדים</a></li>
        <li><a href="/supplier-list">רשימת ספקים</a></li>
        <li><a href="/work-schedule">סידור עבודה</a></li>
        </ul>
      </div>
      <div className="welcome-window">
        <h1 id="welcomeMessage">Welcome, {username}</h1>
        <p id="description">Here is a brief description of the dashboard and what you can do here. Feel free to explore the features and functionalities tailored for you.</p>
      </div>
    </div>
  );
}

export default Employee;
