// models/shift.js

const mongoose = require('mongoose');

const shiftSchema = new mongoose.Schema({
    employeeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    week: {
        type: String, // Format: YYYY-WW (e.g., 2024-28 for the 28th week of 2024)
        required: true
    },
    shifts: [{
        date: {
            type: Date,
            required: true
        },
        morningShift: {
            type: Boolean,
            default: false
        },
        noonShift: {
            type: Boolean,
            default: false
        },
        nightShift: {
            type: Boolean,
            default: false
        },
        morningShiftHours: {
            type: String,
            default: '07:00-15:00'
        },
        noonShiftHours: {
            type: String,
            default: '15:00-23:00'
        },
        nightShiftHours: {
            type: String,
            default: '23:00-07:00'
        }
    }]
});
const Shift = mongoose.model('Shift', shiftSchema);

module.exports = Shift;
