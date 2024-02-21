import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/manager.css";
import Menu from "./Menu";
import LogoutButton from "./LogoutButton";
import WelcomeContainer from "./welcomeContainer";

function Manager() {
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState("");
  const [userName, setUserName] = useState("");
  const [authorized, setAuthorized] = useState(false);
  useEffect(() => {
    const userRoleFromLocal = localStorage.getItem("UserRole");
    setUserRole(userRoleFromLocal);
  }, []);

  useEffect(() => {
    const userNameFromLocal = localStorage.getItem("Username");
    setUserName(userNameFromLocal);
  }, []);

  useEffect(() => {
    fetch("/manager")
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
    return <div>Loading...</div>;
  }

  return (
    <div>
      <LogoutButton />
      <Menu userRole={userRole} />
      <WelcomeContainer userName={userName} />
    </div>
  );
}

export default Manager;
