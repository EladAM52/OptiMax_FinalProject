import React, { useState } from "react";
import "../css/addUser.css";

const AddUserForm = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    idNumber: "",
    role: "",
    dateOfBirth: "",
    familyStatus: "",
    address: {
      street: "",
      city: "",
    },
  });

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
          name="username"
          value={formData.username}
          onChange={handleChange}
          placeholder="שם העובד"
          required
        />
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
          placeholder="רחוב"
        />
      </div>
      <div className="form-field">
        <input
          type="text"
          name="city"
          value={formData.address.city}
          onChange={handleChange}
          placeholder="עיר"
        />
      </div>
      <div className="form-field">
        <button type="submit">הוסף עובד</button>
      </div>
    </form>
  );
};

export default AddUserForm;
