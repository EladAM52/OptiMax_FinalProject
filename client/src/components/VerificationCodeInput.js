import React, { useState, createRef } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

function VerificationCodeInput() {
  const navigate = useNavigate();
  const [digits, setDigits] = useState(Array(6).fill(""));
  const inputRefs = Array(6)
    .fill()
    .map(() => createRef());

  const handleChange = (index, event) => {
    const newDigits = [...digits];
    newDigits[index] = event.target.value.slice(0, 1).replace(/[^0-9]/g, "");
    setDigits(newDigits);

    if (event.target.value && index < 5) {
      inputRefs[index + 1].current.focus();
    } else if (!event.target.value && index > 0) {
      inputRefs[index - 1].current.focus();
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
        });
        setDigits(Array(6).fill(""));
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
            ref={inputRefs[index]}
            type="text"
            value={digit}
            onChange={(e) => handleChange(index, e)}
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
