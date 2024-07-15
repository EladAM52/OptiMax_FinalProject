import React, { useEffect, useState, useCallback } from "react";
import Swal from "sweetalert2";
import "../css/ShiftSchedule.css";

const ShiftArrangement = () => {
    const [arrangements, setArrangements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentWeek, setCurrentWeek] = useState("");
    const [weekDates, setWeekDates] = useState([]);
    const [availableEmployees, setAvailableEmployees] = useState({});

    function getCurrentWeek() {
        const currentDate = new Date();
        const firstDayOfYear = new Date(currentDate.getFullYear(), 0, 1);
        const pastDaysOfYear = (currentDate - firstDayOfYear) / 86400000;
        const weekNumber = Math.ceil(
            (pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7
        );
        return `${currentDate.getFullYear()}-${weekNumber
            .toString()
            .padStart(2, "0")}`;
    }

    function getWeekDates(currentDate) {
        const startOfWeek = new Date(currentDate);
        if (startOfWeek.getDay() === 1) {
            startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
        }
        return Array.from({ length: 7 }, (_, i) => {
            const date = new Date(startOfWeek);
            date.setDate(startOfWeek.getDate() + i);
            return date.toISOString().split("T")[0]; // Format the date as YYYY-MM-DD
        });
    }

    const fetchAvailableEmployees = useCallback(async () => {
        try {
            const response = await fetch(`/getAvailableEmployees/${currentWeek}`);
            const data = await response.json();
            // console.log('Fetched Data:', data);
            setAvailableEmployees(data);
            setLoading(false);
        } catch (err) {
            setError(err);
            setLoading(false);
        }
    }, [currentWeek]);

    useEffect(() => {
        const initialWeek = getCurrentWeek();
        setCurrentWeek(initialWeek);
        setWeekDates(getWeekDates(new Date()));
    }, []);

    useEffect(() => {
        if (currentWeek) {
            fetchAvailableEmployees();
        }
    }, [currentWeek, fetchAvailableEmployees]);

    const handleShiftChange = (date, shiftType, employeeId) => {
        setArrangements((prev) => {
            const newArr = [...prev];
            const index = newArr.findIndex((arr) => arr.date === date);
            if (index !== -1) {
                newArr[index][shiftType] = employeeId;
            } else {
                newArr.push({ date, [shiftType]: employeeId });
            }
            return newArr;
        });
    };

    const handleSaveChanges = async () => {
        try {
            const response = await fetch(`/saveShiftArrangements/${currentWeek}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ arrangements }),
            });

            if (!response.ok) {
                throw new Error("Failed to save arrangements");
            }

            Swal.fire({
                icon: "success",
                text: "הסידור נשמר בהצלחה",
            });
        } catch (err) {
            console.error("Error saving arrangements", err);
        }
    };

    // const handleWeekChange = (direction) => {
    //     console.log(currentWeek);
    //     const [year, week] = currentWeek.split('-').map(Number);
    //     const newWeek = direction === 'next' ? week + 1 : week - 1;
    //     const newYear = newWeek > 52 ? year + 1 : newWeek < 1 ? year - 1 : year;
    //     const validNewWeek = newWeek > 52 ? 1 : newWeek < 1 ? 52 : newWeek;

    //     setCurrentWeek(`${newYear}-${validNewWeek.toString().padStart(2, '0')}`);
    //     const newDate = new Date(newYear, 0, (validNewWeek - 1) * 7);
    //     setWeekDates(getWeekDates(newDate));
    //     setLoading(true);
    // };

    const handleWeekChange = (direction) => {
        const [year, week] = currentWeek.split("-").map(Number);
        const newWeek = direction === "next" ? week + 1 : week - 1;
        const newYear = newWeek > 52 ? year + 1 : newWeek < 1 ? year - 1 : year;
        const validNewWeek = newWeek > 52 ? 1 : newWeek < 1 ? 52 : newWeek;
        const newDate = new Date(weekDates[0]);
        newDate.setDate(newDate.getDate() + (direction === "next" ? 7 : -7));
        const newWeekDates = getWeekDates(newDate);
        setWeekDates(newWeekDates);
        setCurrentWeek(`${newYear}-${validNewWeek.toString().padStart(2, "0")}`);
        setLoading(true);
    };

    const handleClearSelections = () => {
        setArrangements([]);
    };

    if (loading) return <div className="spinner"></div>;
    if (error) return <div>Error: {error.message}</div>;

    const daysOfWeek = ["ראשון", "שני", "שלישי", "רביעי", "חמישי", "שישי", "שבת"];

    return (
        <div className="shift-schedule" dir="rtl">
            <h1>סידור עבודה</h1>
            <div className="week-navigation">
                <button onClick={() => handleWeekChange("prev")}>שבוע קודם</button>
                <span>
                    {new Date(weekDates[0]).toLocaleDateString()} -{" "}
                    {new Date(weekDates[6]).toLocaleDateString()}
                </span>
                <button onClick={() => handleWeekChange("next")}>שבוע הבא</button>
            </div>
            <div className="shift-table">
                <div className="shift-table-header">
                    <div className="shift-table-header-day">משמרות</div>
                    {daysOfWeek.map((day, index) => (
                        <div key={index} className="shift-table-header-day">
                            {day}
                            <br />
                            {new Date(weekDates[index]).toLocaleDateString()}
                        </div>
                    ))}
                </div>
                {[
                    { key: "morningShift", label: "משמרת בוקר" },
                    { key: "noonShift", label: "משמרת צהריים" },
                    { key: "nightShift", label: "משמרת לילה" },
                ].map((shiftType, index) => (
                    <div key={index} className="shift-table-row">
                        <div className="shift-table-row-label">{shiftType.label}</div>
                        {weekDates.map((date, index) => (
                            <div key={index} className="shift-table-cell">
                                <select
                                    value={
                                        arrangements.find((arr) => arr.date === date)?.[
                                        shiftType.key
                                        ] || ""
                                    }
                                    onChange={(e) =>
                                        handleShiftChange(date, shiftType.key, e.target.value)
                                    }
                                >
                                    <option value="">בחר עובד</option>
                                    {(availableEmployees[date]?.[shiftType.key] || []).map(
                                        (emp) => (
                                            <option
                                                key={`${date}-${shiftType.key}-${emp._id}`}
                                                value={emp._id}
                                            >
                                                {emp.FirstName} {emp.LastName}
                                            </option>
                                        )
                                    )}
                                </select>
                            </div>
                        ))}
                    </div>
                ))}
            </div>
            <div className="button-container">
                <button onClick={handleSaveChanges} className="save-button">
                    שמירת שינויים
                </button>
                <button onClick={handleClearSelections} className="clear-button">
                    נקה בחירות
                </button>
            </div>
        </div>
    );
};

export default ShiftArrangement;
