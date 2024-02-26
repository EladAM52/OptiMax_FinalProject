import React, { useEffect, useState } from "react";
import "../css/workersManagement.css";

const UsersTable = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
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
  }, []);

  if (isLoading) {
    return <div className="loading-container"><div className="spinner"></div></div>;
}

  return (
    <div className="users-table-container">
      <div className="add-user-container">
        <button className="add-user-button">
          הוסף משתמש חדש
        </button>
      </div>
      <table className="users-table" dir="rtl">
        <thead>
          <tr>
            <th>שם משתמש</th>
            <th>אימייל</th>
            <th>תפקיד</th>
            <th>פעולות</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>
                <button className="edit-button">ערוך</button>
                <button className="delete-button">מחק</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UsersTable;
