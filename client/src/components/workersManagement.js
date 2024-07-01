import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/workersManagement.css";

const UsersTable = () => {
  const navigate = useNavigate();
  const navigateToAddUser = () => {
    navigate("/adduser");
  };
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    setIsLoading(true);
    fetch("/getusers")
      .then((response) => response.json())
      .then((data) => {
        setUsers(data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
        setIsLoading(false);
      });
  };

  const navigateTouserprofile = (userid) => {
    navigate(`/UserProfile/${userid}`);
  };

  const deleteUser = async (userid) => {
    const endpoint = `/deleteUser/${userid}`;
    const options = {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    };

    try {
      const response = await fetch(endpoint, options);

      if (response.ok) {
        alert("User deleted successfully!");
        fetchUsers();
      } else {
        const responseData = await response.json();
        console.error(responseData.message);
        alert("Failed to delete User. Please try again.");
      }
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
      alert("Failed to delete User. Please check your network and try again.");
    }
  };

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="workers-container">
      <h1 className="h1"> פאנל ניהול עובדים</h1>
      <div className="add-user-container">
        <button className="add-user-button" onClick={navigateToAddUser}>
          הוסף משתמש חדש
        </button>
      </div>
      <div className="tablescroll">
        <div className="users-table-container">
          <table className="users-table" dir="rtl">
            <thead>
              <tr>
                <th>שם פרטי</th>
                <th>שם משפחה</th>
                <th>אימייל</th>
                <th>תפקיד</th>
                <th>פעולות</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td>{user.FirstName}</td>
                  <td>{user.LastName}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>
                    <button
                      className="edit-button"
                      onClick={() => navigateTouserprofile(user._id)}
                    >
                      פרופיל העובד
                    </button>
                    <button
                      className="delete-button"
                      onClick={() => deleteUser(user._id)}
                    >
                      הסר עובד
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UsersTable;
