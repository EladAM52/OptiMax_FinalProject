import React, { useState, useEffect, useCallback } from "react";
import "../css/ShiftSchedule.css";

const ShiftArrangementViewer = () => {
    const [arrangements, setArrangements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [responseStatus, setResponseStatus] = useState(null);
    const [currentWeek, setCurrentWeek] = useState("");
    const [weekDates, setWeekDates] = useState([]);

    const getCurrentWeek = () => {
        const currentDate = new Date();
        const firstDayOfYear = new Date(currentDate.getFullYear(), 0, 1);
        const pastDaysOfYear = (currentDate - firstDayOfYear) / 86400000;
        const weekNumber = Math.ceil(
            (pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7
        );
        return `${currentDate.getFullYear()}-${weekNumber
            .toString()
            .padStart(2, "0")}`;
    };

    const getWeekDates = (currentDate) => {
        const startOfWeek = new Date(currentDate);
        const dayOfWeek = startOfWeek.getDay();
        const diff = startOfWeek.getDate() - dayOfWeek; // adjust when day is sunday
        startOfWeek.setDate(diff);

        return Array.from({ length: 7 }, (_, i) => {
            const date = new Date(startOfWeek);
            date.setDate(startOfWeek.getDate() + i);
            return date.toISOString().split("T")[0]; // Format the date as YYYY-MM-DD
        });
    };

    const fetchArrangements = useCallback(async () => {
        try {
            const response = await fetch(`/getShiftArrangements/${currentWeek}`);
            if (!response.ok) {
                setResponseStatus(response.status);
                setArrangements([]);
            } else {
                const data = await response.json();
                if (data.arrangements && data.arrangements.length > 0) {
                    setArrangements(data.arrangements);
                    setResponseStatus(null);
                } else {
                    setArrangements([]);
                    setResponseStatus(404);
                }
            }
            setLoading(false);
        } catch (err) {
            setResponseStatus(500);
            setArrangements([]);
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
            fetchArrangements();
        }
    }, [currentWeek, fetchArrangements]);

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

    if (loading) return <div className="spinner"></div>;

    const daysOfWeek = ["ראשון", "שני", "שלישי", "רביעי", "חמישי", "שישי", "שבת"];

    return (
        <div className="shift-schedule" dir="rtl">
            <h1>צפייה בסידור עבודה</h1>
            <div className="week-navigation">
                <button onClick={() => handleWeekChange("prev")}>שבוע קודם</button>
                <span>
                    {new Date(weekDates[0]).toLocaleDateString()} -{" "}
                    {new Date(weekDates[6]).toLocaleDateString()}
                </span>
                <button onClick={() => handleWeekChange("next")}>שבוע הבא</button>
            </div>
            <div className="shift-table">
                {responseStatus === 404 ? (
                    <div className="no-arrangements-message">אין סידור עבודה לשבוע זה.</div>
                ) : responseStatus === 500 ? (
                    <div className="no-arrangements-message">שגיאת שרת, אנא נסה שוב מאוחר יותר.</div>
                ) : arrangements.length === 0 ? (
                    <div className="no-arrangements-message">אין סידור עבודה לשבוע זה.</div>
                ) : (
                    <>
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
                                {weekDates.map((date, index) => {
                                    const arrangement = arrangements.find(
                                        (arr) => new Date(arr.date).toISOString().split("T")[0] === date
                                    );
                                    const employee = arrangement ? arrangement[shiftType.key] : null;
                                    return (
                                        <div key={index} className="shift-table-cell">
                                            {employee ? `${employee.FirstName} ${employee.LastName}` : "לא מוקצה"}
                                        </div>
                                    );
                                })}
                            </div>
                        ))}
                    </>
                )}
            </div>
        </div>
    );
};

export default ShiftArrangementViewer;
