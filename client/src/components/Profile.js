import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../css/Profile.css";

const Profile = () => {
  const [user, setUser] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const { userId } = useParams();
  const [userRole, setUserRole] = useState("");
  useEffect(() => {
    const userRoleFromLocal = localStorage.getItem("UserRole");
    setUserRole(userRoleFromLocal);
  }, []);

  useEffect(() => {
    setIsLoading(true);
    fetch("https://optimax-dqfzcydeh3hce2fh.israelcentral-01.azurewebsites.net/getuserprofile", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        UserId: userId,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setUser(data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching user:", error);
        setIsLoading(false);
      });
  }, [userId]);

  const options = { year: "numeric", month: "long", day: "numeric" };
  const userDateOfBirth = new Date(user.dateOfBirth).toLocaleDateString(
    "he-IL",
    options
  );

  const navigate = useNavigate();
  const editprofile = () => {
    navigate(`https://optimax-dqfzcydeh3hce2fh.israelcentral-01.azurewebsites.net/EditProfile/${userId}`);
  };

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      {userRole==="מנהל" &&
      <button className="editprofile-button" onClick={editprofile}>
        עריכת הפרופיל
      </button>}
      <h1 className="heading">פרופיל אישי</h1>
      <section className="section">
        <h2 className="sub-heading">פרטים אישיים</h2>
        <ul>
          <li>שם פרטי: {user.FirstName}</li>
          <li>שם משפחה: {user.LastName}</li>
          <li> תעודת זהות: {user.idNumber}</li>
          <li>סטטוס משפחתי: {user.familyStatus}</li>
          <li> תפקיד: {user.role}</li>
          <li> מין: {user.gender}</li>
          <li> תאריך לידה: {userDateOfBirth}</li>
        </ul>
      </section>
      <section className="section">
        <h2 className="sub-heading">פרטי התקשרות</h2>
        <ul>
          <li>אימייל: {user.email}</li>
          <li>טלפון: {user.phoneNumber}</li>
          {user.address && (
            <li>
              כתובת מגורים: {user.address.street}, {user.address.city}
            </li>
          )}
        </ul>
      </section>
    </div>
  );
};

export default Profile;
