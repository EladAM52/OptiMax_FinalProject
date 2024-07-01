import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import "../css/addUser.css";

const AddUserForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();
  const navigate = useNavigate();

  const getCurrentDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0"); // Add leading zero
    const day = String(today.getDate()).padStart(2, "0"); // Add leading zero
    return `${year}-${month}-${day}`;
  };

  const onSubmit = async (data) => {
    const endpoint = "/adduser";
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    };

    try {
      const response = await fetch(endpoint, options);
      const responseData = await response.json();

      if (response.ok) {
        console.log(responseData);
        alert("User added successfully!");
        reset(); // Reset the form after successful submission
        navigate("/getusers");
      } else {
        console.error(responseData.message);
        alert("Failed to add user. Please try again.");
      }
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
      alert("Failed to add user. Please check your network and try again.");
    }
  };

  const goBack = () => {
    navigate(-1); // This will take you back one page
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="add-user-wide-form"
      dir="rtl"
    >
      <div className="form-field">
        <input
          type="text"
          {...register("FirstName", { required: "שם פרטי הוא שדה חובה" })}
          placeholder="שם פרטי"
          aria-describedby="FirstName-error"
        />
        {errors.FirstName && (
          <p id="FirstName-error" className="error-message">
            {errors.FirstName.message}
          </p>
        )}
      </div>
      <div className="form-field">
        <input
          type="text"
          {...register("LastName", { required: "שם משפחה הוא שדה חובה" })}
          placeholder="שם משפחה"
          aria-describedby="LastName-error"
        />
        {errors.LastName && (
          <p id="LastName-error" className="error-message">
            {errors.LastName.message}
          </p>
        )}
      </div>
      <div className="form-field">
        <select name="gender" {...register("gender", { required: "בחר מין" })}>
          <option value="">בחר מין</option>
          <option value="זכר">זכר</option>
          <option value="נקבה">נקבה</option>
        </select>
        {errors.gender && (
          <p id="gender-error" className="error-message">
            {errors.gender.message}
          </p>
        )}
      </div>
      <div className="form-field">
        <input
          type="email"
          {...register("email", {
            required: "אימייל הוא שדה חובה",
            pattern: {
              value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
              message: "נא להכניס כתובת אימייל תקינה",
            },
          })}
          placeholder="אימייל"
          aria-describedby="email-error"
        />
        {errors.email && (
          <p id="email-error" className="error-message">
            {errors.email.message}
          </p>
        )}
      </div>
      <div className="form-field">
        <input
          type="text"
          {...register("idNumber", {
            required: "תעודת זהות היא שדה חובה",
            minLength: {
              value: 9,
              message: "תעודת זהות צריכה להכיל 9 תווים",
            },
            maxLength: {
              value: 9,
              message: "תעודת זהות צריכה להכיל 9 תווים",
            },
          })}
          placeholder="תעודת זהות"
          aria-describedby="idNumber-error"
        />
        {errors.idNumber && (
          <p id="idNumber-error" className="error-message">
            {errors.idNumber.message}
          </p>
        )}
      </div>
      <div className="form-field">
        <select name="role" {...register("role", { required: "בחר תפקיד" })}>
          <option value="">בחר תפקיד</option>
          <option value="עובד">עובד</option>
          <option value="מנהל">מנהל</option>
        </select>
        {errors.role && (
          <p id="role-error" className="error-message">
            {errors.role.message}
          </p>
        )}
      </div>
      <div className="form-field">
        <input
          type="text"
          {...register("phoneNumber", {
            required: "מספר טלפון הוא שדה חובה",
            pattern: {
              value: /^\d{10}$/,
              message: "מספר טלפון צריך להיות 10 ספרות",
            },
          })}
          placeholder="מספר טלפון"
          aria-describedby="phoneNumber-error"
        />
        {errors.phoneNumber && (
          <p id="phoneNumber-error" className="error-message">
            {errors.phoneNumber.message}
          </p>
        )}
      </div>
      <div className="form-field">
        <input
          type="date"
          {...register("dateOfBirth", {
            required: "תאריך לידה הוא שדה חובה",
            validate: (value) => {
              return (
                new Date(value) <= new Date() ||
                "תאריך הלידה לא יכול להיות בעתיד"
              );
            },
          })}
          max={getCurrentDate()}
          aria-describedby="dateOfBirth-error"
        />
        {errors.dateOfBirth && (
          <p id="dateOfBirth-error" className="error-message">
            {errors.dateOfBirth.message}
          </p>
        )}
      </div>
      <div className="form-field">
        <select
          name="familyStatus"
          {...register("familyStatus", {
            required: "סטטוס משפחתי הוא שדה חובה",
          })}
        >
          <option value="">בחר סטטוס משפחתי</option>
          <option value="רווק/ה">רווק/ה</option>
          <option value="נשוי/ה">נשוי/ה</option>
          <option value="גרוש/ה">גרוש/ה</option>
          <option value="אלמן/ה">אלמן/ה</option>
        </select>
        {errors.familyStatus && (
          <p id="familyStatus-error" className="error-message">
            {errors.familyStatus.message}
          </p>
        )}
      </div>
      <div className="form-field">
        <input
          type="text"
          {...register("address.street", {
            required: "כתובת היא שדה חובה",
            pattern: {
              value: /^[\u0590-\u05FF0-9\s]+$/,
              message: "נא להזין כתובת בעברית ומספרים בלבד",
            },
          })}
          placeholder="כתובת"
          aria-describedby="address-street-error"
        />
        {errors.address?.street && (
          <p id="address-street-error" className="error-message">
            {errors.address.street.message}
          </p>
        )}
      </div>
      <div className="form-field">
        <input
          type="text"
          {...register("address.city", {
            required: "עיר מגורים היא שדה חובה",
            pattern: {
              value: /^[\u0590-\u05FF\s]+$/,
              message: "נא להזין עיר בעברית בלבד",
            },
          })}
          placeholder="עיר מגורים"
          aria-describedby="address-city-error"
        />
        {errors.address?.city && (
          <p id="address-city-error" className="error-message">
            {errors.address.city.message}
          </p>
        )}
      </div>
      <div className="form-field">
        <button type="submit">הוסף עובד</button>
        <button type="button" onClick={goBack}>
          חזור
        </button>
      </div>
    </form>
  );
};

export default AddUserForm;
