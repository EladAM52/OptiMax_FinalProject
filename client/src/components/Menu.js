import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faHandshake,faCalendarDays,faUsers,faUser, faTasks,faClipboard,faFileImport } from "@fortawesome/free-solid-svg-icons";
import "../css/Menu.css";
import { Link } from "react-router-dom";
import logo from '../images/logo.png'; 


const Menu = ({ userRole, isOpen}) => {
  return (
    <div className={`sidebar ${isOpen ? "open" : ""}`} dir="rtl">
      <div className="sidebar-logo">
        <img src={logo} alt="Logo" className="logo" />
      </div>
      <ul>
        <li>
        <a ><FontAwesomeIcon icon={faUser} />  פרטים אישיים</a>
        </li>

        {userRole === "מנהל" && (
          <>
            <li>
              <a><FontAwesomeIcon icon={faTasks} /> יומן משימות</a>
            </li>
            <li>
              <Link to="/getusers" >
              <FontAwesomeIcon icon={faUsers}/>ניהול עובדים 
              </Link>
            </li>
            <li>
            <a><FontAwesomeIcon icon={faHandshake} /> ניהול ספקים</a>
            </li>
            <li>
            <a><FontAwesomeIcon icon={faCalendarDays} />סידור עבודה</a>
            </li>
          </>
        )}
        {userRole === "עובד" && (
          <>
            <li>
            <a><FontAwesomeIcon icon={faTasks} /> יומן משימות</a>
            </li>
            <li>
              <a> <FontAwesomeIcon icon={faClipboard}  /> אילוצים</a>
            </li>
            <li>
              <a> <FontAwesomeIcon icon={faFileImport} />העלת מסמכים</a>
            </li>
            <li>
            <a><FontAwesomeIcon icon={faCalendarDays} />סידור עבודה</a>
            </li>
          </>
        )}
      </ul>
    </div>
  );
};

export default Menu;
