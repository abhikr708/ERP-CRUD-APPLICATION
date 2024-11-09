const mongoose = require('mongoose');

const salarySchema = new mongoose.Schema({
    uID: {
        type: Number,
        required: true,
        unique: true
    },
    name:{
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['Admin', 'SalesManager', 'Labour', 'HR'], // Matches roles in User model
        required: true
    },
    email: {
        type: String,
        required: true
    },
    baseSalary: {
        type: Number,
        required: true
    },
    bonus: {
        type: Number,
        default: 0
    },
    deductions: {
        type: Number,
        default: 0
    }
});

const Salary = mongoose.model('Salary', salarySchema);
module.exports = Salary;