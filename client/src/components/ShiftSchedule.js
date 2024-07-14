import React, { useEffect, useState, useCallback } from 'react';
import Swal from 'sweetalert2';
import "../css/ShiftSchedule.css";

const ShiftSchedule = () => {
    const employeeId = localStorage.getItem("UserId");
    const [shifts, setShifts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [noShiftsMessage, setNoShiftsMessage] = useState('');
    const [currentWeek, setCurrentWeek] = useState(getCurrentWeek());
    const [weekDates, setWeekDates] = useState(getWeekDates(new Date()));
    const [shiftsExistInDb, setShiftsExistInDb] = useState(false);

    // Calculate the current week in format YYYY-WW
    function getCurrentWeek() {
        const currentDate = new Date();
        const firstDayOfYear = new Date(currentDate.getFullYear(), 0, 1);
        const pastDaysOfYear = (currentDate - firstDayOfYear) / 86400000;
        const weekNumber = Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
        return `${currentDate.getFullYear()}-${weekNumber.toString().padStart(2, '0')}`;
    }

    function getWeekDates(currentDate) {
        const startOfWeek = new Date(currentDate);
        startOfWeek.setDate(startOfWeek.getDate());
        return Array.from({ length: 7 }, (_, i) => {
            const date = new Date(startOfWeek);
            date.setDate(startOfWeek.getDate() + i);
            return date.toISOString().split('T')[0]; // Format the date as YYYY-MM-DD
        });
    }

    const getDefaultShiftsForWeek = useCallback(() => {
        return weekDates.map(date => ({
            date, 
            morningShift: false,
            noonShift: false,
            nightShift: false,
            morningShiftHours: '07:00-15:00',
            noonShiftHours: '15:00-23:00',
            nightShiftHours: '23:00-07:00',
        }));
    }, [weekDates]);

    const fetchShifts = useCallback(async () => {
        try {
            const response = await fetch(`/getEmployeeShifts/${employeeId}/${currentWeek}`);
            const data = await response.json();
            if (data.length === 0) {
                setNoShiftsMessage('לא קיימות משמרות עבורך לשבוע זה');
                setShiftsExistInDb(false);
            } else {
                setNoShiftsMessage('');
                setShiftsExistInDb(true);
            }
            setShifts(data.length > 0 ? data : getDefaultShiftsForWeek());
            setLoading(false);
        } catch (err) {
            setError(err);
            setLoading(false);
        }
    }, [employeeId, currentWeek, getDefaultShiftsForWeek]);

    useEffect(() => {
        fetchShifts();
    }, [fetchShifts]);


    function handleShiftChange(date, shiftType) {
        setShifts(shifts.map(shift =>
            shift.date === date ? { ...shift, [shiftType]: !shift[shiftType] } : shift
        ));
    }

    function getLocalDate(date) {
        const d = new Date(date);
        return d.toISOString().split('T')[0];
    }

    function handleDayClick(date) {
        console.log(date);

        if (shifts.length === 0) {
            setShifts(getDefaultShiftsForWeek().map(shift =>
                getLocalDate(shift.date) === date ? { ...shift, morningShift: true, noonShift: true, nightShift: true } : shift
            ));
        } else {
            setShifts(shifts.map(shift =>
                getLocalDate(shift.date) === date ? { ...shift, morningShift: true, noonShift: true, nightShift: true } : shift
            ));
        }
    }

    async function handleClearAll() {
        const confirmation = await Swal.fire({
            title: '?האם אתה בטוח',
            text: "פעולה זו תמחק את כל המשמרות שלך ולא ניתן לבטל אותה",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'מחק',
            cancelButtonText: 'בטל'
        });

        if (confirmation.isConfirmed) {
            if (shiftsExistInDb) {
                try {
                    const response = await fetch(`/deleteShifts/${employeeId}/${currentWeek}`, {
                        method: 'DELETE'
                    });

                    if (!response.ok) {
                        Swal.fire({
                            icon:'success',
                            text: 'כל המשמרות שלך נמחקו בהצלחה',
                    });
                        throw new Error('Failed to delete shifts');
                        
                    }
                    setShiftsExistInDb(false);
                    fetchShifts();
                    Swal.fire({
                        icon:'success',
                        text: 'כל המשמרות שלך נמחקו בהצלחה',
                });
                } catch (err) {
                    console.error('Error deleting shifts', err);
                }
            } else {
                setShifts(shifts.map(shift => ({
                    ...shift,
                    morningShift: false,
                    noonShift: false,
                    nightShift: false
                })));
            }
        }
    }

    async function handleSaveChanges() {
        if (shifts.every(shift => !shift.morningShift && !shift.noonShift && !shift.nightShift)) {
            Swal.fire({
                icon: 'error',
                text: 'עליך לבחור לפחות משמרת אחת לפני שמירה'
            });
            return;
        }

        try {
            const response = await fetch(`/updateShifts/${employeeId}/${currentWeek}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ shifts })
            });

            if (!response.ok) {
                throw new Error('Failed to save shifts');
            }

            Swal.fire({
                icon: 'success',
                text: 'המשמרות נשמרו בהצלחה'
            });
            setShiftsExistInDb(true);
            fetchShifts(); 
        } catch (err) {
            console.error('Error saving shifts', err);
        }
    }

    const handleWeekChange = (direction) => {
        const [year, week] = currentWeek.split('-').map(Number);
        const newWeek = direction === 'next' ? week + 1 : week - 1;
        const newYear = newWeek > 52 ? year + 1 : newWeek < 1 ? year - 1 : year;
        const validNewWeek = newWeek > 52 ? 1 : newWeek < 1 ? 52 : newWeek;

        setCurrentWeek(`${newYear}-${validNewWeek.toString().padStart(2, '0')}`);
        const newDate = new Date(newYear, 0, 1 + (validNewWeek - 1) * 7);
        setWeekDates(getWeekDates(newDate));
        setLoading(true);
        setNoShiftsMessage('');
    }

    if (loading) return <div className='spinner'></div>;
    if (error) return <div>Error: {error.message}</div>;

    const daysOfWeek = ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת'];

    const hasCheckedShifts = shifts.some(shift => shift.morningShift || shift.noonShift || shift.nightShift);

    return (
        <div className="shift-schedule" dir='rtl'>
            <h1>יומן משמרות</h1>
            <div className="week-navigation">
                <button onClick={() => handleWeekChange('prev')}>שבוע קודם</button>
                <span>{new Date(weekDates[0]).toLocaleDateString()} - {new Date(weekDates[6]).toLocaleDateString()}</span>
                <button onClick={() => handleWeekChange('next')}>שבוע הבא</button>
            </div>
            {noShiftsMessage && (
                <div className="no-shifts-message">{noShiftsMessage}</div>
            )}
            <div className="shift-table">
                <div className="shift-table-header">
                    <div className="shift-table-header-day">משמרות</div>
                    {daysOfWeek.map((day, index) => (
                        <div key={index} className="shift-table-header-day" onClick={() => handleDayClick(weekDates[index])}>
                            {day}<br />{new Date(weekDates[index]).toLocaleDateString()}
                        </div>
                    ))}
                </div>
                {[
                    { key: 'morningShift', label: 'משמרת בוקר', hours: '07:00-15:00' },
                    { key: 'noonShift', label: 'משמרת צהריים', hours: '15:00-23:00' },
                    { key: 'nightShift', label: 'משמרת לילה', hours: '23:00-07:00' }
                ].map((shiftType, index) => (
                    <div key={index} className="shift-table-row">
                        <div className="shift-table-row-label">
                            {shiftType.label}
                        </div>
                        {shifts.map((shift, index) => (
                            <div key={index} className="shift-table-cell">
                                <input
                                    type="checkbox"
                                    checked={shift[shiftType.key]}
                                    onChange={() => handleShiftChange(shift.date, shiftType.key)}
                                />
                            </div>
                        ))}
                    </div>
                ))}
            </div>
            <div className="button-container">
                <button onClick={handleSaveChanges} className="save-button">שמירת שינויים</button>
                <button onClick={handleClearAll} className="clear-button" disabled={!hasCheckedShifts}>נקה הכל</button>
            </div>
        </div>
    );
};

export default ShiftSchedule;
