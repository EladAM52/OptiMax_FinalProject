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
    const [allEmployees, setAllEmployees] = useState([]);

    const fetchAllEmployees = useCallback(async () => {
        try {
            const response = await fetch("/getusers");
            const data = await response.json();
            setAllEmployees(data);
        } catch (err) {
            setError(err);
        }
    }, []);

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
        const dayOfWeek = startOfWeek.getDay();
        const diff = startOfWeek.getDate() - dayOfWeek ; // adjust when day is sunday
        startOfWeek.setDate(diff);
        

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
            fetchAllEmployees();
            fetchAvailableEmployees();
        }
    }, [currentWeek, fetchAvailableEmployees, fetchAllEmployees]);

    useEffect(() => {
        if (!loading && !error && Object.keys(availableEmployees).length > 0) {
            const shiftCounts = allEmployees.reduce((acc, emp) => {
                acc[emp._id] = 0;
                return acc;
            }, {});

            const initialArrangements = weekDates.reduce((acc, date) => {
                const shifts = ["morningShift", "noonShift", "nightShift"];
                const dailyArrangement = { date: new Date(date) };

                shifts.forEach(shift => {
                    const availableWorkers = availableEmployees[date]?.[shift] || [];
                    if (availableWorkers.length > 0) {
                        let selectedEmployee = null;

                        for (const worker of availableWorkers) {
                            const previousDate = new Date(date);
                            previousDate.setDate(previousDate.getDate() - 1);
                            const previousDateString = previousDate.toISOString().split("T")[0];

                            if (!dailyArrangement.morningShift && !dailyArrangement.noonShift && !dailyArrangement.nightShift) {
                                if (!acc.some(arr => arr.date.toISOString().split("T")[0] === previousDateString && arr.nightShift === worker._id)) {
                                    selectedEmployee = worker;
                                    break;
                                }
                            } else if (!Object.values(dailyArrangement).includes(worker._id)) {
                                selectedEmployee = worker;
                                break;
                            }
                        }

                        if (selectedEmployee) {
                            shiftCounts[selectedEmployee._id]++;
                            dailyArrangement[shift] = selectedEmployee._id;
                        }
                    }
                });

                return [...acc, dailyArrangement];
            }, []);

            const validateShiftArrangements = (arrangementsToValidate) => {
                const dayAssignments = {};

                for (const arrangement of arrangementsToValidate) {
                    const date = arrangement.date.toISOString().split("T")[0];
                    if (!dayAssignments[date]) {
                        dayAssignments[date] = {};
                    }

                    for (const shiftType of ["morningShift", "noonShift", "nightShift"]) {
                        const employeeId = arrangement[shiftType];
                        if (employeeId) {
                            if (!dayAssignments[date][employeeId]) {
                                dayAssignments[date][employeeId] = {};
                            }

                            if (Object.keys(dayAssignments[date][employeeId]).length > 0) {
                                console.log(`Duplicate found: ${employeeId} on ${date} for shift ${shiftType}`);
                                return false;
                            }

                            if (shiftType === "morningShift") {
                                const previousDate = new Date(arrangement.date);
                                previousDate.setDate(previousDate.getDate() - 1);
                                const previousDateString = previousDate.toISOString().split("T")[0];

                                if (dayAssignments[previousDateString] && dayAssignments[previousDateString][employeeId]?.nightShift) {
                                    console.log(`Invalid shift: ${employeeId} assigned to morning shift on ${date} after night shift on ${previousDateString}`);
                                    return false;
                                }
                            }

                            dayAssignments[date][employeeId][shiftType] = true;
                        }
                    }
                }
                return true;
            };

            if (validateShiftArrangements(initialArrangements)) {
                setArrangements(initialArrangements);
            } else {
                Swal.fire({
                    icon: "error",
                    text: "Automatic filling of shifts failed due to invalid assignments.",
                });
            }
        }
    }, [loading, error, availableEmployees, weekDates, allEmployees]);

    const validateShiftArrangements = () => {
        const dayAssignments = {};

        for (const arrangement of arrangements) {
            const date = arrangement.date.toISOString().split("T")[0];
            if (!dayAssignments[date]) {
                dayAssignments[date] = {};
            }

            for (const shiftType of ["morningShift", "noonShift", "nightShift"]) {
                const employeeId = arrangement[shiftType];
                if (employeeId) {
                    // Ensure dayAssignments[date][employeeId] is an object
                    if (!dayAssignments[date][employeeId]) {
                        dayAssignments[date][employeeId] = {};
                    }

                    // Check if the employee is already assigned to another shift on the same day
                    if (Object.keys(dayAssignments[date][employeeId]).length > 0) {
                        console.log(`Duplicate found: ${employeeId} on ${date} for shift ${shiftType}`);
                        return false; // Duplicate assignment found
                    }

                    // Check if the employee is assigned a morning shift after a night shift
                    if (shiftType === "morningShift") {
                        const previousDate = new Date(arrangement.date);
                        previousDate.setDate(previousDate.getDate() - 1);
                        const previousDateString = previousDate.toISOString().split("T")[0];

                        if (dayAssignments[previousDateString] && dayAssignments[previousDateString][employeeId]?.nightShift) {
                            console.log(`Invalid shift: ${employeeId} assigned to morning shift on ${date} after night shift on ${previousDateString}`);
                            return false; // Invalid shift assignment
                        }
                    }

                    // Store the shift type for the current day
                    dayAssignments[date][employeeId][shiftType] = true;
                }
            }
        }
        return true;
    };

    const validateAllShiftsManned = () => {
        for (const arrangement of arrangements) {
            if (!arrangement.morningShift || !arrangement.noonShift || !arrangement.nightShift) {
                return false;
            }
        }
        return true;
    };
    const handleSaveChanges = async () => {
        if (!validateAllShiftsManned()) {
            Swal.fire({
                icon: "error",
                text: "עליך לבחור לפחות עובד אחד לכל משמרת",
            });
            return;
        }

        const isValid = validateShiftArrangements();
        console.log(`Validation result: ${isValid}`);  // Debugging log

        if (!isValid) {
            Swal.fire({
                icon: "error",
                text: "לא ניתן לשמור סידור בו עובד משוייך ליותר ממשמרת אחת ביום או כאשר עובד משובץ למשמרת בוקר אחרי משמרת לילה ",
            });
            return;
        }

        try {
            const response = await fetch(`/saveShiftArrangements/${currentWeek}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ week: currentWeek, arrangements }),
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

    const handleWeekChange = (direction) => {
        const [year, week] = currentWeek.split("-").map(Number);
        const newWeek = direction === "next" ? week + 1 : week - 1;
        const newYear = newWeek > 52 ? year + 1 : newWeek < 1 ? year - 1 : year;
        const validNewWeek = newWeek > 52 ? 1 : newWeek < 1 ? 52 : newWeek;
        const newDate = new Date(weekDates[0]);
        console.log(newDate);
        newDate.setDate(newDate.getDate() + (direction === "next" ? 7 : -7));
        console.log(newDate);
        const newWeekDates = getWeekDates(newDate);
        setWeekDates(newWeekDates);
        console.log(newWeekDates);
        setCurrentWeek(`${newYear}-${validNewWeek.toString().padStart(2, "0")}`);
        setLoading(true);
    };

    const handleClearSelections = () => {
        const clearedArrangements = weekDates.map(date => ({
            date: new Date(date),
            morningShift: null,
            noonShift: null,
            nightShift: null
        }));
        setArrangements(clearedArrangements);
    };

    const handleDateClick = (date) => {
        setArrangements((prev) => prev.map((arr) => {
            if (arr.date.toISOString().split("T")[0] === date) {
                return { ...arr, morningShift: null, noonShift: null, nightShift: null };
            }
            return arr;
        }));
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
                        <div
                            key={index}
                            className="shift-table-header-day"
                            onClick={() => handleDateClick(weekDates[index])}
                            style={{ cursor: "pointer" }}
                        >
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
                                    value={arrangements.find((arr) => arr.date.toISOString().split("T")[0] === date)?.[shiftType.key] || ""}
                                    onChange={(e) => {
                                        const selectedEmployeeId = e.target.value;
                                        setArrangements((prev) =>
                                            prev.map((arr) => {
                                                if (arr.date.toISOString().split("T")[0] === date) {
                                                    return { ...arr, [shiftType.key]: selectedEmployeeId };
                                                }
                                                return arr;
                                            })
                                        );
                                    }}
                                >
                                    <option value="">בחר עובד</option>
                                    {allEmployees.map((emp) => (
                                        <option
                                            key={`${date}-${shiftType.key}-${emp._id}`}
                                            value={emp._id}
                                            style={{
                                                color: availableEmployees[date]?.[shiftType.key]?.some((e) => e._id === emp._id)
                                                    ? "black"
                                                    : "red",
                                            }}
                                        >
                                            {emp.FirstName} {emp.LastName}
                                        </option>
                                    ))}
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
