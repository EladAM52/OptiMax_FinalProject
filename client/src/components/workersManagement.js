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
        setUsers(data.users); // Assuming the data returned has a users array
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
        setIsLoading(false);
      });
  }, []);

  const handleDelete = (userId) => {
    // Implement user deletion logic here, possibly with a confirmation dialog
    console.log("Deleting user with ID:", userId);
    // After deletion, you could refetch the users list or splice the array locally
  };

  const handleEdit = (userId) => {
    // Navigate to user edit page or open a modal for editing
    console.log("Editing user with ID:", userId);
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="users-table-container">
      <button className="add-user-button" onClick={() => {/* Navigate to add user page or open a modal */}}>הוסף משתמש חדש</button>
      <div className="table-scroll">
        <table className="users-table">
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
                  <button onClick={() => handleEdit(user._id)}>ערוך</button>
                  <button onClick={() => handleDelete(user._id)}>מחק</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UsersTable;
