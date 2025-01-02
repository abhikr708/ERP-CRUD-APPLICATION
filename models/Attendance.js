const mongoose = require('mongoose');
const User = require('./User');

const attendanceSchema = new mongoose.Schema({
    uID: {
        type: Number,
        required: true,
        ref: 'User'
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
    attendance: [
        {
            date: {
                type: Date,
                required: true
            },
            status: {
                type: String,
                enum: ['Present', 'Absent'],
                required: true
            }

        }
    ]
});

// Middleware to populate fields from User schema before saving
attendanceSchema.pre('save', async function (next) {
    if (this.isNew || this.isModified('uID')) {
        try {
            const user = await mongoose.model('User').findOne({ uID: this.uID });
            if (user) {
                this.name = user.name;
                this.role = user.role;
                this.email = user.email;
            } else {
                return next(new Error('User not found'));
            }
        } catch (error) {
            return next(error);
        }
    }
    next();
});


const Attendance = mongoose.model('Attendance', attendanceSchema);
module.exports = Attendance;