import React, { useState, useEffect } from "react";
import "../css/HomePendingTasks.css";

const HomePendingTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await fetch("/getTasks"); // Replace with your endpoint
      const data = await response.json();
      setTasks(data.filter((task) => !task.completed));
    } catch (error) {
      console.error("Error fetching tasks:", error);
      // Handle error
    } finally {
      setLoading(false);
    }
  };

  const renderTasks = (tasksToRender) => (
    <ul className="hometask-list">
      {tasksToRender.map((task) => (
        <li key={task._id} className="hometask-item">
          <div>
            <h3 className={task.completed ? "completed" : ""}>
              כותרת: {task.title}
            </h3>
            <p>{task.description}</p>
          </div>
        </li>
      ))}
    </ul>
  );

  return (
    <div className="hometask-log-container" dir="rtl">
      <h2 className="hometask-h2">משימות הממתינות לטיפולך:</h2>
      <div className="hometask-tablescroll">
        {loading ? (
          <p>טוען משימות...</p>
        ) : tasks.length === 0 ? (
          <p>אין משימות ממתינות.</p>
        ) : (
          renderTasks(tasks)
        )}
      </div>
    </div>
  );
};

export default HomePendingTasks;
