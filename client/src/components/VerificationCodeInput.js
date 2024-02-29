import React, { useState ,useEffect } from 'react';
import { useNavigate } from "react-router-dom";
function VerificationCodeInput() {
  const [code, setCode] = useState('');
  const navigate = useNavigate();
  const [userCode, setUserCode] = useState("");

  useEffect(() => {
    const userCodeFromLocal = localStorage.getItem("UserCode");
    setUserCode(userCodeFromLocal);
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    if(userCode === code){
    console.log('login');
    navigate('/homepage');
    }
    else{
        console.log('error');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        maxLength="6"
        placeholder="הזן את קוד האימות שקיבלת"
        // Style the input for better visibility and usability
        style={{ textAlign: 'center', fontSize: '20px', padding: '10px', margin: '10px 0', width: '270px' }}
      />
      <button type="submit" style={{ padding: '10px 20px', fontSize: '18px' }}>כניסה</button>
    </form>
  );
}

export default VerificationCodeInput;
