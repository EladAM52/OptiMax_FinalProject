import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faTimes, faHouse } from "@fortawesome/free-solid-svg-icons";
import LogoutButton from "./LogoutButton";
import Menu from "./Menu";
import "../css/navbar.css";
import { useNavigate } from "react-router-dom";

const Navbar = ({ userRole }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  const handleMenuHomePage = () => {
    navigate("/homepage");
  };
  return (
    <nav className="navbar">
      <button className="menu-toggle" onClick={handleMenuToggle}>
        <FontAwesomeIcon icon={isMenuOpen ? faBars : faTimes} />
      </button>
      <button className="homepageButtom" onClick={handleMenuHomePage}>
        <FontAwesomeIcon icon={faHouse} />
      </button>
      <Menu isOpen={isMenuOpen}/>
      <LogoutButton />
    </nav>
  );
};

export default Navbar;
