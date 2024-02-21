import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import '../css/login.css';
import logo from '../images/logo.png';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); // Initialize useNavigate hook

  const handleLogin = async (e) => {
    e.preventDefault(); // Prevent the default form submission

    const response = await fetch('http://localhost:5000/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (data.success) {
      Swal.fire({
        icon: 'success',
        title: 'התחברות מוצלחת',
        text: 'תועבר בקרוב.',
        showConfirmButton: false,
        timer: 1500
      }).then(() => {
        // Use navigate to change route
        if(data.role === 'admin'){
          navigate('/manager'); // Navigate to Manager page for admin
        }
        else{
          navigate('/employee'); // Navigate to Employee page or whatever path you have for employees
        }
      });
    } else {
      Swal.fire({
        icon: 'error',
        title: 'התחברות נכשלה',
        text: 'נסיון ההתחברות שלך לא הצליח. אנא נסה שנית.',
        confirmButtonText: 'סגור'
      }).then(() => {
        setEmail('');
        setPassword('');
      });
    }
  };

  return (
    <div className="login-container" dir="rtl">
  <form onSubmit={handleLogin}>
    <div className="text-center mb-4">
      <img src={logo} alt="Logo" className="logo" />
    </div>
    <h3>כניסה למערכת</h3>
    <div className="input-group">
      <span className="input-group-text"><i className="fas fa-envelope"></i></span>
      <input
        type="email"
        placeholder="דואר אלקטרוני"
        name="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
    </div>
    <div className="input-group">
      <span className="input-group-text"><i className="fas fa-lock"></i></span>
      <input
        type="password"
        placeholder="סיסמה"
        name="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        
      />
    </div>
    <button type="submit" className="loginButton">התחברות</button>
  </form>
</div>

  );
}

export default Login;
