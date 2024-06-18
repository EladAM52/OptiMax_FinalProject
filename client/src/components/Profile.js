import React, { useState, useEffect } from "react";
import "../css/Profile.css";


const Profile = () => {
    const [user, setUser] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    
    useEffect(() => {
        setIsLoading(true);
        fetch("/getuserprofile", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "UserId": localStorage.getItem("UserId"),
          },
        })
          .then((response) => response.json())
          .then((data) => {
            setUser(data);
            setIsLoading(false);
          })
          .catch((error) => {
            console.error("Error fetching users:", error);
            setIsLoading(false);
          });
      }, []);

    
    if (isLoading) {
      return (
        <div className="loading-container">
          <div className="spinner"></div>
        </div>
      );
    }

  return (
    <div className="container" >
      <h1 className="heading">פרופיל אישי</h1>
      <section className="section">
        <h2 className="sub-heading">פרטים אישיים</h2>
        <ul>
        <li>שם: {user.FirstName}</li>
        <li>אימייל: {user.email}</li>
        <li>טלפון: {user.phoneNumber}</li>
        {/* Add more fields as needed */}
      </ul>
      </section>
      
      <section className="section">
        <h2 className="sub-heading">פרטי התקשרות</h2>
      </section>
    </div>
  );
};

export default Profile;
