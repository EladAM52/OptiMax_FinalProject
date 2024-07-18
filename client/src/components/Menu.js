import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
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
             {/* <li>
              <Link to="/ShiftSchedule">
                <FontAwesomeIcon icon={faClipboard} /> אילוצים
              </Link>
            </li> */}
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
              <Link to="/ShiftArrangement">
                <FontAwesomeIcon icon={faCalendarDays} />
                סידור עבודה
              </Link>
            </li>
          </>
        )}
        {userrole === "עובד" && (
          <>
            <li>
              <Link to="/ShiftSchedule">
                <FontAwesomeIcon icon={faClipboard} /> אילוצים
              </Link>
            </li>
            <li>
              <Link to="/ShiftArrangementViewer">
                <FontAwesomeIcon icon={faCalendarDays} /> סידור עבודה
              </Link>
            </li>
            <li>
              <Link to="/EmployeeShiftsViewer">
                <FontAwesomeIcon icon={faCalendarDays} />  המשמרות שלי
              </Link>
            </li>
            <li>
              <Link to="/Documents">
                <FontAwesomeIcon icon={faFileImport} /> העלאת מסמכים
              </Link>
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
