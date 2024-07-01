import React, { useState, useEffect, useCallback} from "react";
import "../css/uploadDocuments.css";

const FileUpload = () => {
  const [file, setFile] = useState("");
  const [fileName, setFileName] = useState("");
  const [documents, setDocuments] = useState([]);
  const [fileNameError, setFileNameError] = useState("");
  const userId = localStorage.getItem("UserId");
  const userRole = localStorage.getItem("UserRole");

  const fetchDocuments = useCallback(async () => {
    try {
      const response = await fetch(
        `/getfiles?role=${userRole}&userId=${userId}`
      );
      const data = await response.json();
  
      if (Array.isArray(data)) {
        setDocuments(data);
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
      alert("Please select a file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("filename", fileName);
    formData.append("userId", localStorage.getItem("UserId"));

    try {
      const response = await fetch("/upload-files", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        alert("File uploaded successfully!");
        setFile(""); // Clear file state
        setFileName(""); // Clear fileName state
        setFileNameError(""); // Clear error message
        fetchDocuments(); // Refresh the documents list
      } else {
        const errorMessage = await response.text();
        console.error("Failed to upload file:", errorMessage);
        alert("Failed to upload file. Please try again.");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Failed to upload file. Please try again.");
    }
  };

  const handleOpenDocument = async (url) => {
    window.open(url, "_blank");
  };

  const handleDelete = async (docId) => {
    try {
      const response = await fetch(`/deleteDocument/${docId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setDocuments(documents.filter((doc) => doc._id !== docId));
        alert("Document deleted successfully!");
      } else {
        alert("Failed to delete document.");
      }
    } catch (error) {
      console.error("Error deleting document:", error);
      alert("Failed to delete document. Please try again.");
    }
  };



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
      {(userRole === "מנהל") ? 
      <h3>מסמכים קיימים:</h3> : <h3>מסמכים קיימים בתיק האישי:</h3> }
      <div className="documents-list-container">
        <ul className="documents-list">
          {documents.map((doc) => (
            <li key={doc._id} className="document-item">
              <div>
              <ul>
          <li>כותרת : {doc.optionalFileName}</li>
          <li>שם המסמך: {doc.originalfileName}</li>
          {(userRole === "מנהל") &&
          <li>
            הועלה על ידי:
            <ul>
            <li>תעודת זהות: {doc.uploadedBy.idNumber}</li>
            <li>שם מלא: {doc.uploadedBy.firstName} {doc.uploadedBy.lastName}</li>
            </ul>
          </li>}
          <li>תאריך העלאה: {doc.dateOfUpload}</li>
        </ul>
                <button 
                className="watch-button"
                  onClick={() =>
                    handleOpenDocument(
                      `http://localhost:3000/files/${doc.fileName}`
                    )
                  }
                >
                  הצגת מסמך
                </button>
                {userRole === "מנהל" &&
                <button className="delete-button" onClick={() => handleDelete(doc._id)}>מחיקה</button>}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default FileUpload;
