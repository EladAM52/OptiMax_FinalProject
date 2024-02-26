import React, { useState } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import "../css/login.css";

function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault(); // Prevent the default form submission
    setIsLoading(true);
    const response = await fetch("/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    setIsLoading(false);

    if (data.success) {
      localStorage.setItem("Username", data.username);
      localStorage.setItem("UserRole", data.role);
      Swal.fire({
        icon: "success",
        title: "התחברות מוצלחת",
        text: "תועבר בקרוב.",
        showConfirmButton: false,
        timer: 1500,
      }).then(() => {
        setEmail("");
        setPassword("");
        navigate("/homepage");
      });
    } else {
      Swal.fire({
        icon: "error",
        title: "התחברות נכשלה",
        text: "נסיון ההתחברות שלך לא הצליח. אנא נסה שנית.",
        confirmButtonText: "סגור",
      }).then(() => {
        setEmail("");
        setPassword("");
      });
    }
  };

  return (
    <div>
      <form id="loginForm" onSubmit={handleLogin} dir="rtl">
        <div className="text-center mb-4">
          <img src="../images/logo.png" alt="Logo" className="logo" />
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
          type="password"
          placeholder="סיסמה"
          id="password"
          name="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit" id="loginButton" disabled={isLoading}>
          {isLoading ? <div className="spinner"></div> : "התחברות"}
        </button>
      </form>
    </div>
  );
}

export default Login;
