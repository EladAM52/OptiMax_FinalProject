import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/employee.css'; // Adjust the path as necessary

function Employee() {
  const navigate = useNavigate();
  const [authorized, setAuthorized] = useState(false);
  const [username, setUsername] = useState('');
  useEffect(() => {
      fetch('/get-username')
      .then(response => response.json())
      .then(data => {
          setUsername(data.username);
        })
        .catch(error => console.error('Error:', error));
    }, []);
    
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
      fetch('/employee')
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
      <div className="sidebar">
        <div className="sidebar-logo">
          <img src="../images/logo.png" alt="Logo" className="logo" />
        </div>
        {/* <ul>
          <li><a href="#">פרטים אישיים</a></li>
          <li><a href="#">יומן משימות</a></li>
          <li><a href="#">רשימת עובדים</a></li>
          <li><a href="#">רשימת ספקים</a></li>
          <li><a href="#">סידור עבודה</a></li>
        </ul> */}
      </div>
      <div className="welcome-window">
        <h1 id="welcomeMessage">Welcome, {username}</h1>
        <p id="description">Here is a brief description of the dashboard and what you can do here. Feel free to explore the features and functionalities tailored for you.</p>
      </div>
    </div>
  );
}

export default Employee;
