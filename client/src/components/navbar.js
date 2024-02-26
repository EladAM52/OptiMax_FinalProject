import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faTimes } from "@fortawesome/free-solid-svg-icons";
import LogoutButton from "./LogoutButton"; 
import Menu from "./Menu";
import "../css/navbar.css";

const Navbar = ({userRole}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="navbar">
      <button className="menu-toggle" onClick={handleMenuToggle}>
        <FontAwesomeIcon icon={isMenuOpen ? faTimes : faBars} />
      </button>
      <Menu isOpen={isMenuOpen} userRole={userRole} />
      <LogoutButton />
    </nav>
  );
};

export default Navbar;
