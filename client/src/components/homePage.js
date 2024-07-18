import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/homePage.css";
import WelcomeContainer from "./welcomeContainer";
import HomePendingTasks from "./HomePendingTasks";
import CurrentWeekShiftsViewer from "./CurrentWeekShiftsViewer";

function HomePage() {
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState("");
  const [FirstName, setUserName] = useState("");
  const [authorized, setAuthorized] = useState(false);
  useEffect(() => {
    const userRoleFromLocal = localStorage.getItem("UserRole");
    setUserRole(userRoleFromLocal);
  }, []);

  useEffect(() => {
    const userNameFromLocal = localStorage.getItem("FirstName");
    setUserName(userNameFromLocal);
  }, []);

  useEffect(() => {
    fetch("/homepage")
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Not authorized");
        }
      })
      .then((data) => {
        if (data.success) {
          setAuthorized(true);
        } else {
          navigate("/login");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        navigate("/login");
      });
  });

  if (!authorized) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div>
      <WelcomeContainer FirstName={FirstName} userRole={userRole} />
      {userRole === "מנהל" && <HomePendingTasks />}
      {userRole === "עובד" && <CurrentWeekShiftsViewer />}
    </div>
  );
}

export default HomePage;
