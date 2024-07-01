import React, { useEffect, useState } from "react";
import Navbar from "./navbar";

const Layout = ({ children }) => {
  const [userRole, setUserRole] = useState("");
  useEffect(() => {
    const userRoleFromLocal = localStorage.getItem("UserRole");
    setUserRole(userRoleFromLocal);
  }, []);
  return (
    <>
      <Navbar userRole={userRole} />
      <div>{children}</div>
    </>
  );
};

export default Layout;
