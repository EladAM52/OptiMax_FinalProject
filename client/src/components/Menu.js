import React from "react";
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
// import logo from "../images/logo1.png";

const Menu = ({ userRole, isOpen }) => {
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

        {userRole === "מנהל" && (
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
        {userRole === "עובד" && (
          <>
            <li>
              <a>
                {" "}
                <FontAwesomeIcon icon={faClipboard} /> אילוצים
              </a>
            </li>
            <li>
              <Link to="/Documents">
                <FontAwesomeIcon icon={faHandshake} /> העלאת מסמכים
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
    </div>
  );
};

export default Menu;
