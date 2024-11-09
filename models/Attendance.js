const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
    uID: {
        type: Number,
        required: true
    },
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['Admin', 'SalesManager', 'Labour', 'HR'],
        required: true
    },
    date: {
        type: Date,
        default: Date.now,
        required: true
    },
    status: {
        type: String,
        enum: ['Present', 'Absent', 'Late'],
        default: 'Present'
    }
});

const Attendance = mongoose.model('Attendance', attendanceSchema);
module.exports = Attendance;