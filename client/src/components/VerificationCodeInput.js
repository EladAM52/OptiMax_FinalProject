import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

function VerificationCodeInput() {
  const navigate = useNavigate();
  const [digits, setDigits] = useState(Array(6).fill(""));
  const inputRefs = useRef([]);

  const handleChange = (index, event) => {
    const value = event.target.value.slice(0, 1).replace(/[^0-9]/g, "");
    setDigits((prevDigits) => {
      const newDigits = [...prevDigits];
      newDigits[index] = value;
      return newDigits;
    });

    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, event) => {
    if (event.key === "Backspace" && !digits[index] && index > 0) {
      inputRefs.current[index - 1].focus();
      setDigits((prevDigits) => {
        const newDigits = [...prevDigits];
        newDigits[index - 1] = "";
        return newDigits;
      });
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const fullCode = digits.join("");
    try {
      const response = await fetch("/verifyCode", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code: fullCode }),
      });

      const data = await response.json();

      if (data.success) {
        console.log(data.message);
        navigate("/homepage");
      } else {
        Swal.fire({
          icon: "error",
          title: "התחברות נכשלה",
          text: "קוד האימות שלך לא תקין. אנא נסה שנית.",
          confirmButtonText: "סגור",
        }).then(() => {
          setDigits(Array(6).fill(""));
          inputRefs.current[0].focus();
        });
      }
    } catch (error) {
      console.error("Error during verification process:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3
        style={{
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          fontSize: "20px",
        }}
      >
        :אנא הזן את קוד האימות שקיבלת
      </h3>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "10px",
        }}
      >
        {digits.map((digit, index) => (
          <input
            key={index}
            ref={(el) => (inputRefs.current[index] = el)}
            type="text"
            value={digit}
            onChange={(e) => handleChange(index, e)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            maxLength="1"
            style={{
              textAlign: "center",
              fontSize: "20px",
              padding: "5px",
              margin: "5px",
              width: "30px",
              height: "50px",
              border: "1px solid #ccc",
              borderRadius: "4px",
            }}
          />
        ))}
      </div>
      <button
        type="submit"
        style={{
          padding: "10px 20px",
          fontSize: "18px",
          marginTop: "20px",
        }}
      >
        כניסה
      </button>
    </form>
  );
}

export default VerificationCodeInput;
