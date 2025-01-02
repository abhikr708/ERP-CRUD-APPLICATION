const mongoose = require('mongoose');
const User = require('./User'); 

const salarySchema = new mongoose.Schema({
    uID: {
        type: Number,
        required: true,
        ref: 'User'
    },
    name: {
        type: String
    },
    role: {
        type: String,
        enum: ['Admin', 'SalesManager', 'Labour', 'HR'] // Matches roles in User model
    },
    email: {
        type: String
    },
    baseSalary: {
        type: Number,
        default: 0
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

// Middleware to populate fields from User schema before saving
salarySchema.pre('save', async function (next) {
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

const Salary = mongoose.model('Salary', salarySchema);
module.exports = Salary;