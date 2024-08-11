import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
// import { useNavigate } from "react-router-dom";
import "../css/login.css";
import logo from "../images/logo2.png";
import VerificationCodeInput from "./VerificationCodeInput";

function Login() {
  const [isLoading, setIsLoading] = useState(false);
  // const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [idNumber, setidNumber] = useState("");
  const [showVerificationInput, setShowVerificationInput] = useState(false);
  useEffect(() => {
    document.body.classList.add("login");
    return () => {
      document.body.classList.remove("login");
    };
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault(); // Prevent the default form submission
    if (!validateEmail(email)) {
      Swal.fire({
        icon: "error",
        title: "התחברות נכשלה",
        text: "כתובת אימייל אינה תקינה  , אנא נסה שנית",
        confirmButtonText: "סגור",
      }).then(() => {
        setEmail("");
        setidNumber("");
      });
      return;
    }
    if (!validateId(idNumber)) {
      Swal.fire({
        icon: "error",
        title: "התחברות נכשלה",
        text: "תעודת זהות אינה תקינה  , אנא נסה שנית",
        confirmButtonText: "סגור",
      }).then(() => {
        setEmail("");
        setidNumber("");
      });
      return;
    }
    setIsLoading(true);
    const response = await fetch("https://optimax-dqfzcydeh3hce2fh.israelcentral-01.azurewebsites.net/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, idNumber }),
    });

    const data = await response.json();
    setIsLoading(false);

    if (data.success) {
      localStorage.setItem("FirstName", data.FirstName);
      localStorage.setItem("UserRole", data.role);
      localStorage.setItem("UserId", data.userId);
      Swal.fire({
        icon: "success",
        title: "התחברות מוצלחת",
        text: ` ${email.toLowerCase()} : קוד אימות נשלח אלייך למייל `,
        showConfirmButton: false,
        timer: 2000,
      }).then(() => {
        setEmail("");
        setidNumber("");
        setShowVerificationInput(true);
      });
    } else {
      Swal.fire({
        icon: "error",
        title: "התחברות נכשלה",
        text: "נסיון ההתחברות שלך לא הצליח. אנא נסה שנית.",
        confirmButtonText: "סגור",
      }).then(() => {
        setEmail("");
        setidNumber("");
      });
    }
  };

  const validateEmail = (email) => {
    // Regular expression for email validation
    const emailPattern = /^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[a-zA-Z0-9]+$/;
    return emailPattern.test(email);
  };
  const validateId = (idNumber) => {
    // Regular expression for id validation
    const idPattern = /^\d{9}$/;
    return idPattern.test(idNumber);
  };

  if (showVerificationInput) {
    return <VerificationCodeInput />;
  }

  return (
    <div>
      <form id="loginForm" onSubmit={handleLogin} dir="rtl">
        <div className="text-center mb-4">
          <img src={logo} alt="Logo" className="logo" />
        </div>
        <h3>כניסה למערכת</h3>
        <span className="input-group-text" id="basic-addon1">
          <i className="fas fa-envelope"></i>
        </span>
        <input
          type="email"
          placeholder="דואר אלקטרוני"
          id="email"
          name="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <span className="input-group-text" id="basic-addon2">
          <i className="fas fa-lock"></i>
        </span>
        <input
          type="text"
          placeholder="תעודת זהות"
          id="idNumber"
          name="idNumber"
          required
          value={idNumber}
          onChange={(e) => setidNumber(e.target.value)}
        />
        <button type="submit" id="loginButton" disabled={isLoading}>
          {isLoading ? <div className="spinner"></div> : "התחברות"}
        </button>
      </form>
    </div>
  );
}

export default Login;
