import React, { useState, useEffect } from "react";
import "../css/taskLog.css";
import Swal from "sweetalert2";

const TaskLog = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ title: "", description: "" });
  const [editingTask, setEditingTask] = useState(false);
  const [updateTask, setupdateTask] = useState({ title: "", description: "" });
  const [newTaskError, setNewTaskError] = useState({
    title: "",
    description: "",
  });
  const [updateTaskError, setUpdateTaskError] = useState({
    title: "",
    description: "",
  });
  const [selectedTab, setSelectedTab] = useState("pending");

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await fetch("https://optimax-dqfzcydeh3hce2fh.israelcentral-01.azurewebsites.net/getTasks"); // Replace with your endpoint
      const data = await response.json();
      setTasks(data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      // Handle error
    }
  };

  const addTask = async () => {
    if (!newTask.title || !newTask.description) {
      setNewTaskError({
        title: !updateTask.title ? "יש להזין כותרת" : "",
        description: !updateTask.description ? "יש להזין תיאור משימה" : "",
      });
      return;
    }

    const endpoint = "https://optimax-dqfzcydeh3hce2fh.israelcentral-01.azurewebsites.net/newTask";
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newTask),
    };

    try {
      const response = await fetch(endpoint, options);
      const responseData = await response.json();

      if (response.ok) {
        console.log(responseData);
        Swal.fire({
          icon: "success",
          text: "הוספת המשימה הצליחה ",
          showConfirmButton: false,
          timer: 2000,
        }).then(() => {
          setNewTask({ title: "", description: "" }); 
          setNewTaskError({ title: "", description: "" });
          fetchTasks(); 
        });
      } else {
        console.error(responseData.message);
        Swal.fire({
          icon: "error",
          text: "נסיון הוספת משימה לא הצליח. אנא נסה שנית.",
          showConfirmButton: false,
          timer: 2000,
        });
      }
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
      Swal.fire({
        icon: "error",
        text: "נסיון הוספת משימה לא הצליח. אנא בדוק את החיבור לרשת ",
        showConfirmButton: false,
        timer: 2000,
      });
    }
  };

  const deleteTask = async (taskId) => {
    const endpoint = `https://optimax-dqfzcydeh3hce2fh.israelcentral-01.azurewebsites.net/deleteTask/${taskId}`;
    const options = {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    };

    try {
      const response = await fetch(endpoint, options);

      if (response.ok) {
        Swal.fire({
          icon: "success",
          text: "מחיקת המשימה הצליחה ",
          showConfirmButton: false,
          timer: 2000,
        }).then(() => {
          fetchTasks(); 
        });
        
      } else {
        const responseData = await response.json();
        console.error(responseData.message);
        Swal.fire({
          icon: "error",
          text: "נסיון מחיקת משימה לא הצליח. אנא נסה שנית.",
          showConfirmButton: false,
          timer: 2000,
        });
      }
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
      Swal.fire({
        icon: "error",
        text: "נסיון מחיקת משימה לא הצליח. אנא בדוק את החיבור לרשת ",
        showConfirmButton: false,
        timer: 2000,
      });
    }
  };

  const UpdateTask = async (task) => {
    if (!updateTask.title || !updateTask.description) {
      setUpdateTaskError({
        title: !updateTask.title ? "יש להזין כותרת" : "",
        description: !updateTask.description ? "יש להזין תיאור משימה" : "",
      });
      return;
    }
    const endpoint = `https://optimax-dqfzcydeh3hce2fh.israelcentral-01.azurewebsites.net/editTask/${task._id}`;
    const options = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updateTask),
    };

    try {
      const response = await fetch(endpoint, options);

      if (response.ok) {
        Swal.fire({
          icon: "success",
          text: "עדכון המשימה הצליח ",
          showConfirmButton: false,
          timer: 2000,
        }).then(() => {
          setEditingTask(null);
          setupdateTask({ title: "", description: "" });
          setUpdateTaskError({ title: "", description: "" }); 
          fetchTasks();
        });
      } else {
        Swal.fire({
          icon: "error",
          text: "נסיון עדכון משימה לא הצליח. אנא נסה שנית.",
          showConfirmButton: false,
          timer: 2000,
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        text: "נסיון עדכון משימה לא הצליח. אנא בדוק את החיבור לרשת ",
        showConfirmButton: false,
        timer: 2000,
      });
    }
  };

  const markTaskAsDone = async (taskId) => {
    const endpoint = `https://optimax-dqfzcydeh3hce2fh.israelcentral-01.azurewebsites.net/editTask/${taskId}`;
    const options = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ completed: true }),
    };

    try {
      const response = await fetch(endpoint, options);

      if (response.ok) {
        Swal.fire({
          icon: "success",
          text: " המשימה סומנה כבוצעה ",
          showConfirmButton: false,
          timer: 2000,
        }).then(() => {
          fetchTasks();
        });
      } else {
        const responseData = await response.json();
        console.error(responseData.message);
        Swal.fire({
          icon: "error",
          text: "נסיון סימון משימה לא הצליח. אנא נסה שנית.",
          showConfirmButton: false,
          timer: 2000,
        });
      }
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
      Swal.fire({
        icon: "error",
        text: "נסיון סימון משימה לא הצליח. אנא בדוק את החיבור לרשת ",
        showConfirmButton: false,
        timer: 2000,
      });
    }
  };

  const renderTasks = (tasksToRender) => (
    <ul className="task-list">
      {tasksToRender.map((task) => (
        <li key={task._id} className="task-item">
          <div>
            {editingTask && editingTask._id === task._id ? (
              <div className="task-form">
                <div className="form-group">
                  <input
                    type="text"
                    required
                    placeholder="כותרת"
                    value={updateTask.title}
                    onChange={(e) =>
                      setupdateTask({
                        ...updateTask,
                        title: e.target.value,
                      })
                    }
                  />
                  {updateTaskError.title && (
                    <div className="error-message">{updateTaskError.title}</div>
                  )}
                </div>
                <div className="form-group">
                  <input
                    type="text"
                    required
                    placeholder="תיאור משימה"
                    value={updateTask.description}
                    onChange={(e) =>
                      setupdateTask({
                        ...updateTask,
                        description: e.target.value,
                      })
                    }
                  />
                  {updateTaskError.description && (
                    <div className="error-message">
                      {updateTaskError.description}
                    </div>
                  )}
                </div>
                <button onClick={() => UpdateTask(editingTask)}>שמירה</button>
              </div>
            ) : (
              <>
                <h3 className={task.completed ? "completed" : ""}>
                  כותרת: {task.title}
                </h3>
                <p>{task.description}</p>
                <button onClick={() => deleteTask(task._id)}>מחיקה</button>
                <button onClick={() => setEditingTask(task)}>עריכה</button>
                {!task.completed && (
                  <button onClick={() => markTaskAsDone(task._id)}>בוצע</button>
                )}
              </>
            )}
          </div>
        </li>
      ))}
    </ul>
  );

  const pendingTasks = tasks.filter((task) => !task.completed);
  const completedTasks = tasks.filter((task) => task.completed);

  return (
    <div className="task-log-container" dir="rtl">
      <h2>יומן משימות</h2>
      <div className="task-form">
        <div className="form-group">
          <input
            required
            type="text"
            placeholder="כותרת"
            value={newTask.title}
            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
          />
          {newTaskError.title && (
            <div className="error-message">{newTaskError.title}</div>
          )}
        </div>
        <div className="form-group">
          <input
            required
            type="text"
            placeholder="תיאור משימה"
            value={newTask.description}
            onChange={(e) =>
              setNewTask({ ...newTask, description: e.target.value })
            }
          />
          {newTaskError.description && (
            <div className="error-message">{newTaskError.description}</div>
          )}
        </div>
        <button onClick={addTask}>הוסף משימה</button>
      </div>
      <div className="tab-container">
        <button
          className={`tab-button ${selectedTab === "pending" ? "active" : ""}`}
          onClick={() => setSelectedTab("pending")}
        >
          משימות ממתינות
        </button>
        <button
          className={`tab-button ${
            selectedTab === "completed" ? "active" : ""
          }`}
          onClick={() => setSelectedTab("completed")}
        >
          משימות שבוצעו
        </button>
      </div>
      <div className="task-tablescroll">
        {selectedTab === "pending" && pendingTasks.length === 0 && (
          <div className="no-tasks-message">אין משימות ממתינות כרגע.</div>
        )}
        {selectedTab === "completed" && completedTasks.length === 0 && (
          <div className="no-tasks-message">אין משימות שבוצעו כרגע.</div>
        )}
        {selectedTab === "pending" &&
          pendingTasks.length > 0 &&
          renderTasks(pendingTasks)}
        {selectedTab === "completed" &&
          completedTasks.length > 0 &&
          renderTasks(completedTasks)}
      </div>
    </div>
  );
};

export default TaskLog;
