import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../css/EditProfile.css";

const EditProfile = () => {
  const [formData, setFormData] = useState({
    FirstName: "",
    LastName: "",
    gender: "",
    email: "",
    idNumber: "",
    role: "",
    phoneNumber: "",
    dateOfBirth: "",
    familyStatus: "",
    address: {
      street: "",
      city: "",
    },
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      const response = await fetch("/getuserprofile", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "UserId": localStorage.getItem("UserId"),
        },
      });
      const data = await response.json();
      setFormData(data);
    };

    fetchUserProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name in formData.address) {
      setFormData({
        ...formData,
        address: {
          ...formData.address,
          [name]: value,
        },
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = "/updateuserprofile";
    const options = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId: localStorage.getItem("UserId"), ...formData }),
    };

    try {
      const response = await fetch(endpoint, options);
      const data = await response.json();

      if (response.ok) {
        console.log(data);
        alert("פרופיל העובד עודכן בהצלחה");
        navigate("/UserProfile");
      } else {
        console.error(data.message);
        alert("עדכון פרופיל העובד נכשל,נסה שנית");
      }
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
      alert("Failed to update profile. Please check your network and try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="edit-user-wide-form" dir="rtl">
      <div className="form-field">
        <input
          type="text"
          name="FirstName"
          value={formData.FirstName}
          onChange={handleChange}
          placeholder="שם פרטי"
          required
        />
      </div>
      <div className="form-field">
        <input
          type="text"
          name="LastName"
          value={formData.LastName}
          onChange={handleChange}
          placeholder="שם משפחה"
          required
        />
      </div>
      <div className="form-field">
        <select name="gender" value={formData.gender} onChange={handleChange}>
          <option value="">בחר מין</option>
          <option value="זכר">זכר</option>
          <option value="נקבה">נקבה</option>
        </select>
      </div>
      <div className="form-field">
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="אימייל"
          required
        />
      </div>
      <div className="form-field">
        <input
          type="text"
          name="idNumber"
          value={formData.idNumber}
          onChange={handleChange}
          placeholder="תעודת זהות"
          required
        />
      </div>
      <div className="form-field">
        <select name="role" value={formData.role} onChange={handleChange}>
          <option value="">בחר תפקיד</option>
          <option value="עובד">עובד</option>
          <option value="מנהל">מנהל</option>
        </select>
      </div>
      <div className="form-field">
        <input
          type="text"
          name="phoneNumber"
          value={formData.phoneNumber}
          onChange={handleChange}
          placeholder="מספר טלפון"
        />
      </div>
      <div className="form-field">
        <input
          type="date"
          name="dateOfBirth"
          value={formData.dateOfBirth}
          onChange={handleChange}
        />
      </div>
      <div className="form-field">
        <select
          name="familyStatus"
          value={formData.familyStatus}
          onChange={handleChange}
        >
          <option value="">בחר סטטוס משפחתי</option>
          <option value="רווק/ה">רווק/ה</option>
          <option value="נשוי/ה">נשוי/ה</option>
          <option value="גרוש/ה">גרוש/ה</option>
          <option value="אלמן/ה">אלמן/ה</option>
        </select>
      </div>
      <div className="form-field">
        <input
          type="text"
          name="street"
          value={formData.address.street}
          onChange={handleChange}
          placeholder="כתובת"
        />
      </div>
      <div className="form-field">
        <input
          type="text"
          name="city"
          value={formData.address.city}
          onChange={handleChange}
          placeholder=" עיר מגורים"
        />
      </div>
      <div className="form-buttons">
        <button type="submit">שמירת שינויים</button>
        <button type="button" onClick={() => navigate("/UserProfile")}>חזור</button>
      </div>
    </form>
  );
};

export default EditProfile;
