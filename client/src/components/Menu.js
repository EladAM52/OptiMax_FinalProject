import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faHandshake,faCalendarDays,faUsers,faUser, faTasks } from "@fortawesome/free-solid-svg-icons";
import "../css/Menu.css";
const Menu = ({ userRole, isOpen}) => {
  return (
    <div className={`sidebar ${isOpen ? "open" : ""}`} dir="rtl">
      <div className="sidebar-logo">
        <img src="../images/logo.png" alt="Logo" className="logo" />
      </div>
      <ul>
        <li>
        <a ><FontAwesomeIcon icon={faUser} />  פרטים אישיים</a>
        </li>

        {userRole === "admin" && (
          <>
            <li>
              <a><FontAwesomeIcon icon={faTasks} /> יומן משימות</a>
            </li>
            <li>
              <a><FontAwesomeIcon icon={faUsers} />ניהול עובדים </a>
            </li>
            <li>
            <a><FontAwesomeIcon icon={faHandshake} /> ניהול ספקים</a>
            </li>
            <li>
            <a><FontAwesomeIcon icon={faCalendarDays} />סידור עבודה</a>
            </li>
          </>
        )}
        {userRole === "user" && (
          <>
            <li>
              <a>יומן משימות</a>
            </li>
            <li>
              <a>אילוצים</a>
            </li>
            <li>
              <a>העלת מסמכים</a>
            </li>
            <li>
              <a>סידור עבודה</a>
            </li>
          </>
        )}
      </ul>
    </div>
  );
};

export default Menu;
