const mongoose = require('mongoose');

const shiftArrangementSchema = new mongoose.Schema({
    week: {
        type: String, // Format: YYYY-WW
        required: true
    },
    arrangements: [{
        date: {
            type: Date,
            required: true
        },
        morningShift: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            default: null,
        },
        noonShift: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            default: null,
        },
        nightShift: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            default: null,
        }
    }]
});

const ShiftArrangement = mongoose.model('ShiftArrangement', shiftArrangementSchema);

module.exports = ShiftArrangement;
