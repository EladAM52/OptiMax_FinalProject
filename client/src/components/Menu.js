import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHandshake,
  faCalendarDays,
  faUsers,
  faUser,
  faTasks,
  faClipboard,
  faFileImport,
} from "@fortawesome/free-solid-svg-icons";
import "../css/Menu.css";
import { Link } from "react-router-dom";
import logo from "../images/logo2.png";

const Menu = ({ isOpen }) => {
  const [userrole, setUserRole] = useState("");
  useEffect(() => {
    const userRoleFromLocal = localStorage.getItem("UserRole");
    setUserRole(userRoleFromLocal);
  }, []);

  return (
    <div className={`sidebar ${isOpen ? "open" : ""}`} dir="rtl">
      <div className="sidebar-logo"></div>
      <ul>
        <li>
          <Link to={`/UserProfile/${localStorage.getItem("UserId")}`}>
            <FontAwesomeIcon icon={faUser} />
            פרופיל אישי
          </Link>
        </li>

        {userrole === "מנהל" && (
          <>
            <li>
              <Link to="/TaskLog">
                <FontAwesomeIcon icon={faTasks} /> יומן משימות
              </Link>
            </li>
            <li>
              <Link to="/getusers">
                <FontAwesomeIcon icon={faUsers} />
                ניהול עובדים
              </Link>
            </li>
            <li>
              <Link to="/Documents">
                <FontAwesomeIcon icon={faFileImport} /> ניהול מסמכים
              </Link>
            </li>
            <li>
              <a>
                <FontAwesomeIcon icon={faCalendarDays} />
                סידור עבודה
              </a>
            </li>
          </>
        )}
        {userrole === "עובד" && (
          <>
            <li>
              <a>
                {" "}
                <FontAwesomeIcon icon={faClipboard} /> אילוצים
              </a>
            </li>
            <li>
              <Link to="/Documents">
                <FontAwesomeIcon icon={faFileImport} /> העלאת מסמכים
              </Link>
            </li>
            <li>
              <a>
                <FontAwesomeIcon icon={faCalendarDays} />
                סידור עבודה
              </a>
            </li>
          </>
        )}
      </ul>
      <div className="sidebar-logo-bottom">
        <img src={logo} alt="Optimax Logo" className="logo-image" />
      </div>
    </div>
  );
};

export default Menu;
