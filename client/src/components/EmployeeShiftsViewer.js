import React, { useState, useEffect, useCallback } from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";
import "../css/EmployeeShiftsViewer.css";

const EmployeeShiftsViewer = () => {
    const [shifts, setShifts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [responseStatus, setResponseStatus] = useState(null);
    const [currentWeek, setCurrentWeek] = useState("");
    const [weekDates, setWeekDates] = useState([]);
    const [employeeId, setEmployeeId] = useState("");
    const [monthlyShifts, setMonthlyShifts] = useState([]);

    useEffect(() => {
        const storedEmployeeId = localStorage.getItem("UserId");
        setEmployeeId(storedEmployeeId);
    }, []);

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

    const fetchEmployeeShifts = useCallback(async () => {
        if (!employeeId) return;

        try {
            const response = await fetch(`/getShiftArrangements/${currentWeek}`);
            if (!response.ok) {
                setResponseStatus(response.status);
                setShifts([]);
            } else {
                const data = await response.json();
                const filteredShifts = data.arrangements.map(arrangement => {
                    return {
                        date: arrangement.date,
                        morningShift: arrangement.morningShift && arrangement.morningShift._id === employeeId ? arrangement.morningShift : null,
                        noonShift: arrangement.noonShift && arrangement.noonShift._id === employeeId ? arrangement.noonShift : null,
                        nightShift: arrangement.nightShift && arrangement.nightShift._id === employeeId ? arrangement.nightShift : null,
                        morningShiftHours: arrangement.morningShift && arrangement.morningShift._id === employeeId ? "07:00-15:00" : null,
                        noonShiftHours: arrangement.noonShift && arrangement.noonShift._id === employeeId ? "15:00-23:00" : null,
                        nightShiftHours: arrangement.nightShift && arrangement.nightShift._id === employeeId ? "23:00-07:00" : null
                    };
                }).filter(shift => shift.morningShift || shift.noonShift || shift.nightShift);

                setShifts(filteredShifts);
                setResponseStatus(null);
            }
            setLoading(false);
        } catch (err) {
            setResponseStatus(500);
            setShifts([]);
            setLoading(false);
        }
    }, [currentWeek, employeeId]);

    const getCurrentMonth = () => {
        const currentDate = new Date();
        const month = (currentDate.getMonth() + 1).toString().padStart(2, "0");
        return `${currentDate.getFullYear()}-${month}`;
    };

    const fetchMonthlyEmployeeShifts = useCallback(async () => {
        if (!employeeId) return;

        const currentMonth = getCurrentMonth();
        const [year, month] = currentMonth.split('-').map(Number);
        console.log(currentMonth);

        try {
            const response = await fetch(`/getShiftArrangementsForMonth/${currentMonth}`);
            if (!response.ok) {
                setResponseStatus(response.status);
                setMonthlyShifts([]);
            } else {
                const data = await response.json();
                console.log(data);
                const filteredShifts = [];

                data.arrangements.forEach(week => {
                    week.arrangements.forEach(arrangement => {
                        const shiftDate = new Date(arrangement.date);
                        if (
                            (shiftDate.getFullYear() === year && shiftDate.getMonth() === month - 1) &&
                            ((arrangement.morningShift && arrangement.morningShift._id === employeeId) ||
                                (arrangement.noonShift && arrangement.noonShift._id === employeeId) ||
                                (arrangement.nightShift && arrangement.nightShift._id === employeeId))
                        ) {
                            filteredShifts.push({
                                date: arrangement.date,
                                morningShift: arrangement.morningShift && arrangement.morningShift._id === employeeId ? arrangement.morningShift : null,
                                noonShift: arrangement.noonShift && arrangement.noonShift._id === employeeId ? arrangement.noonShift : null,
                                nightShift: arrangement.nightShift && arrangement.nightShift._id === employeeId ? arrangement.nightShift : null,
                                morningShiftHours: arrangement.morningShift && arrangement.morningShift._id === employeeId ? "07:00-15:00" : null,
                                noonShiftHours: arrangement.noonShift && arrangement.noonShift._id === employeeId ? "15:00-23:00" : null,
                                nightShiftHours: arrangement.nightShift && arrangement.nightShift._id === employeeId ? "23:00-07:00" : null
                            });
                        }
                    });
                });

                setMonthlyShifts(filteredShifts);
                setResponseStatus(null);
            }
        } catch (err) {
            setResponseStatus(500);
            setMonthlyShifts([]);
        }
    }, [employeeId]);

    useEffect(() => {
        const initialWeek = getCurrentWeek();
        setCurrentWeek(initialWeek);
        setWeekDates(getWeekDates(new Date()));
    }, []);

    useEffect(() => {
        if (currentWeek) {
            fetchEmployeeShifts();
        }
    }, [currentWeek, fetchEmployeeShifts]);

    useEffect(() => {
        fetchMonthlyEmployeeShifts();
    }, [fetchMonthlyEmployeeShifts]);

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

    const generatePDF = () => {
        const doc = new jsPDF();

        // Set document properties
        doc.setProperties({
            title: 'Monthly Shifts Report',
            subject: 'Monthly Shifts Report',
            author: 'Your Company',
            keywords: 'generated, pdf, javascript',
            creator: 'Your Company'
        });

        doc.setFont('Helvetica');
        doc.setFontSize(16);
        doc.text("Monthly Shifts Report", 10, 10);
        let y = 20;

        const currentMonth = getCurrentMonth();
        doc.setFontSize(12);
        doc.text(`Date range: ${currentMonth}`, 10, y);
        y += 10;

        let totalHours = 0;
        doc.setFontSize(10);

        // Define table columns and rows
        const columns = ["Date", "Shift", "Hours"];
        const rows = [];

        monthlyShifts.forEach(shift => {
            const date = new Date(shift.date).toLocaleDateString();
            if (shift.morningShift) {
                rows.push([date, "Morning shift", shift.morningShiftHours]);
                totalHours += 8;
            }
            if (shift.noonShift) {
                rows.push([date, "Noon shift", shift.noonShiftHours]);
                totalHours += 8;
            }
            if (shift.nightShift) {
                rows.push([date, "Night shift", shift.nightShiftHours]);
                totalHours += 8;
            }
        });

        // Add table to the document
        doc.autoTable({
            head: [columns],
            body: rows,
            startY: y,
            theme: 'grid',
            styles: {
                halign: 'left', // Align text to the left
                font: 'Helvetica', // Set the font to Helvetica
            },
            headStyles: {
                fillColor: [255, 255, 255], // White background for header
                textColor: [0, 0, 0], // Black text color for header
            }
        });

        y = doc.previousAutoTable.finalY + 10; // Update y position after table

        doc.text(`Total monthly hours: ${totalHours}`, 10, y);
        doc.save("Monthly_Shifts_Report.pdf");
    };


    if (loading) return <div className="employee-spinner"></div>;

    return (
        <div className="employee-shift-schedule" dir="rtl">
            <h1>המשמרות שלי לשבוע זה</h1>
            <div className="employee-week-navigation">
                <button onClick={() => handleWeekChange("prev")}>שבוע קודם</button>
                <span>
                    {new Date(weekDates[0]).toLocaleDateString()} -{" "}
                    {new Date(weekDates[6]).toLocaleDateString()}
                </span>
                <button onClick={() => handleWeekChange("next")}>שבוע הבא</button>
            </div>
            {responseStatus === 404 ? (
                <div className="employee-no-arrangements-message">אין משמרות מוקצות לשבוע זה.</div>
            ) : responseStatus === 500 ? (
                <div className="employee-no-arrangements-message">שגיאת שרת, אנא נסה שוב מאוחר יותר.</div>
            ) : shifts.length === 0 ? (
                <div className="employee-no-arrangements-message">אין משמרות מוקצות לשבוע זה.</div>
            ) : (
                <>
                    <div className="employee-shift-cards-container">
                        {shifts.map((shift, index) => (
                            <div key={index} className="employee-shift-card">
                                <div className="employee-shift-card-date">
                                    {new Date(shift.date).toLocaleDateString()}
                                </div>
                                <div className="employee-shift-card-detail">
                                    {shift.morningShift && (
                                        <div>
                                            <div>משמרת בוקר</div>
                                            <div>{shift.morningShiftHours}</div>
                                        </div>
                                    )}
                                    {shift.noonShift && (
                                        <div>
                                            <div>משמרת צהריים</div>
                                            <div>{shift.noonShiftHours}</div>
                                        </div>
                                    )}
                                    {shift.nightShift && (
                                        <div>
                                            <div>משמרת לילה</div>
                                            <div>{shift.nightShiftHours}</div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                    <button className="export-pdf-button" onClick={generatePDF}>דוח שעות חודשי</button>
                </>
            )}
        </div>
    );
};

export default EmployeeShiftsViewer;
