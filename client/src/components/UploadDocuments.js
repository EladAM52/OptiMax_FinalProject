import React, { useState, useEffect, useCallback } from "react";
import "../css/uploadDocuments.css";
import Swal from "sweetalert2";

const FileUpload = () => {
  const [loading, setLoading] = useState(true);
  const [file, setFile] = useState("");
  const [fileName, setFileName] = useState("");
  const [documents, setDocuments] = useState([]);
  const [fileNameError, setFileNameError] = useState("");
  const userId = localStorage.getItem("UserId");
  const userRole = localStorage.getItem("UserRole");

  const fetchDocuments = useCallback(async () => {
    try {
      const response = await fetch(
        `https://optimax-dqfzcydeh3hce2fh.israelcentral-01.azurewebsites.net/getfiles?role=${userRole}&userId=${userId}`
      );
      const data = await response.json();

      if (Array.isArray(data)) {
        if (userRole !== "מנהל") {
          const filteredDocuments = data.filter(
            (doc) => doc.uploadedBy.userId === userId
          );
          setDocuments(filteredDocuments);
          setLoading(false);
        } else {
          setDocuments(data);
          setLoading(false);
        }
        console.log("Fetched documents:", data);
      } else {
        console.error("Fetched data is not an array:", data);
      }
    } catch (error) {
      console.error("Error fetching documents:", error);
    }
  }, [userRole, userId]);
  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!fileName) {
      setFileNameError("יש להזין כותרת לקובץ.");
      return;
    }

    if (!file) {
      Swal.fire({
        icon: "error",
        text: "יש לבחור קובץ ולנסות שנית",
        confirmButtonText: "סגור",
      });
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("filename", fileName);
    formData.append("userId", localStorage.getItem("UserId"));

    try {
      const response = await fetch("https://optimax-dqfzcydeh3hce2fh.israelcentral-01.azurewebsites.net/upload-files", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        Swal.fire({
          icon: "success",
          text: "העלאת הקובץ הצליחה ",
          showConfirmButton: false,
          timer: 2000,
        }).then(() => {
          setFile("");
          setFileName("");
          setFileNameError("");
          fetchDocuments();
        });
      } else {
        const errorMessage = await response.text();
        console.error("Failed to upload file:", errorMessage);
        Swal.fire({
          icon: "error",
          text: "נסיון העלאה שלך לא הצליח. אנא נסה שנית.",
          showConfirmButton: false,
          timer: 2000,
        });
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      Swal.fire({
        icon: "error",
        text: "נסיון העלאה שלך לא הצליח. אנא נסה שנית.",
        showConfirmButton: false,
        timer: 2000,
      });
    }
  };

  const handleOpenDocument = async (url) => {
    window.open(url, "_blank");
  };

  const handleDelete = async (docId) => {
    try {
      const response = await fetch(`https://optimax-dqfzcydeh3hce2fh.israelcentral-01.azurewebsites.net/deleteDocument/${docId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setDocuments(documents.filter((doc) => doc._id !== docId));
        Swal.fire({
          icon: "success",
          text: " הקובץ נמחק בהצלחה ",
          showConfirmButton: false,
          timer: 2000,
        });
      } else {
        Swal.fire({
          icon: "error",
          text: "נסיון המחיקה שלך לא הצליח. אנא נסה שנית.",
          showConfirmButton: false,
          timer: 2000,
        });
      }
    } catch (error) {
      console.error("Error deleting document:", error);
      Swal.fire({
        icon: "error",
        text: "נסיון המחיקה שלך לא הצליח. אנא נסה שנית.",
        showConfirmButton: false,
        timer: 2000,
      });
    }
  };

  if (loading) return <div className="spinner"></div>;

  return (
    <div className="upload-documents-container" dir="rtl">
      <h2>העלאת מסמכים</h2>
      <div className="upload-form">
        <label htmlFor="file-upload" className="file-upload-button">
          בחירת קובץ
        </label>
        <input
          type="file"
          accept="application/pdf"
          id="file-upload"
          onChange={handleFileChange}
        />
        <input
          type="text"
          placeholder="כותרת"
          value={fileName}
          onChange={(e) => {
            setFileName(e.target.value);
            setFileNameError(""); // Clear error message on input change
          }}
        />
        <button onClick={handleUpload}>העלאה</button>
      </div>
      {fileNameError && <div className="error-message">{fileNameError}</div>}
      <div className="file-selected-message">
        {file ? `המסמך שנבחר : ${file.name}` : "לא נבחר מסמך עדיין"}
      </div>
      {userRole === "מנהל" ? (
        <h3>מסמכים קיימים:</h3>
      ) : (
        <h3>מסמכים קיימים בתיק האישי:</h3>
      )}
      {documents.length === 0 && (
        <div className="no-documents-message">אין מסמכים לתצוגה כרגע.</div>
      )}
      <div className="documents-list-container">
        <ul className="documents-list">
          {documents.map((doc) => (
            <li key={doc._id} className="document-item">
              <div>
                <ul>
                  <li>כותרת : {doc.optionalFileName}</li>
                  <li>שם המסמך: {doc.originalfileName}</li>
                  {userRole === "מנהל" && (
                    <li>
                      הועלה על ידי:
                      <ul>
                        <li>תעודת זהות: {doc.uploadedBy.idNumber}</li>
                        <li>
                          שם מלא: {doc.uploadedBy.firstName}{" "}
                          {doc.uploadedBy.lastName}
                        </li>
                      </ul>
                    </li>
                  )}
                  <li>תאריך העלאה: {doc.dateOfUpload}</li>
                </ul>
                <button
                  className="watch-button"
                  onClick={() =>
                    handleOpenDocument(
                      `https://optimax-dqfzcydeh3hce2fh.israelcentral-01.azurewebsites.net/files/${doc.fileName}`
                    )
                  }
                >
                  הצגת מסמך
                </button>
                {userRole === "מנהל" && (
                  <button
                    className="delete-button"
                    onClick={() => handleDelete(doc._id)}
                  >
                    מחיקה
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default FileUpload;
