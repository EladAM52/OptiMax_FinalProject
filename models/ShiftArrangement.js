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
            ref: 'User'
        },
        noonShift: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        nightShift: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    }]
});

const ShiftArrangement = mongoose.model('ShiftArrangement', shiftArrangementSchema);

module.exports = ShiftArrangement;
