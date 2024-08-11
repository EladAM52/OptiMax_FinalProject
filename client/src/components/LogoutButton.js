import React from "react";

const handleLogout = () => {
  fetch("https://optimax-dqfzcydeh3hce2fh.israelcentral-01.azurewebsites.net/logout", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      if (data.success) {
        localStorage.clear();
        window.location.href = "https://optimax-dqfzcydeh3hce2fh.israelcentral-01.azurewebsites.net/login";
      }
    })
    .catch((error) => {
      console.error(
        "There has been a problem with your fetch operation:",
        error
      );
    });
};

const LogoutButton = () => {
  return (
    <div className="user-info">
      <button
        id="logoutbutton"
        className="logout-button"
        onClick={handleLogout}
      >
        התנתקות
      </button>
    </div>
  );
};

export default LogoutButton;
