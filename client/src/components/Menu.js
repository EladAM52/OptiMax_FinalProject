import React from "react";

const Menu = ({ userRole }) => {
  // Retrieve the user role from localStorage

  return (
    <div className="sidebar" dir="rtl">
      <div className="sidebar-logo">
        <img src="../images/logo.png" alt="Logo" className="logo" />
      </div>
      <ul>
        <li>
          <a href="#">פרטים אישיים</a>
        </li>

        {userRole === "admin" && (
          <>
            <li>
              <a href="#">יומן משימות</a>
            </li>
            <li>
              <a href="#">ניהול עובדים</a>
            </li>
            <li>
              <a href="#">ניהול ספקים</a>
            </li>
            <li>
              <a href="#">סידור עבודה</a>
            </li>
          </>
        )}

        {userRole === "user" && (
          <>
            <li>
              <a href="#">יומן משימות</a>
            </li>
            <li>
              <a href="#">אילוצים</a>
            </li>
            <li>
              <a href="#">העלת מסמכים</a>
            </li>
            <li>
              <a href="#">סידור עבודה</a>
            </li>
          </>
        )}
      </ul>
    </div>
  );
};

export default Menu;
