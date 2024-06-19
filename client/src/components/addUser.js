import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/addUser.css";

const AddUserForm = () => {
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
  const goBack = () => {
    navigate(-1); // This will take you back one page
  };



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
    const endpoint = "/adduser";
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    };

    try {
      const response = await fetch(endpoint, options);
      const data = await response.json();

      if (response.ok) {
        console.log(data);
        alert("User added successfully!");
      } else {
        console.error(data.message);
        alert("Failed to add user. Please try again.");
      }
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
      alert("Failed to add user. Please check your network and try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="add-user-wide-form" dir="rtl">
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
        <select name="gender" value={formData.role} onChange={handleChange}>
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
      <div className="form-field">
        <button type="submit">הוסף עובד</button>
        <button type="button" onClick={goBack}>חזור</button>
      </div>
    </form>
  );
};

export default AddUserForm;
