const Attendance = require('../models/Attendance');
const Salary = require('../models/Salary');
const Task = require('../models/Task');

// Function to mark attendance of the employees
exports.recordAttendance = async (req, res) => {
    try {
        const { uID, name, email, role, date, status } = req.body;
        const newAttendance = new Attendance({
            uID,
            name,
            email,
            role,
            date,
            status
        });

        const response = await newAttendance.save();
        console.log("Attendance marked Successfully");
        res.status(200).json({
            success: true,
            data: response,
            message: 'Attendance recorded successfully'
        });
    } catch (error) {
        console.log("Error recording attendance");
        res.status(500).json({
            success: false,
            error: error.message,
            message: 'Error recording attendance'
        });
    }
};

// Function to calculate attendance
exports.calculateAttendance = async (req, res) => {
    try {
        const { uID } = req.params;
        const totalDays = await Attendance.countDocuments({ uID });
        const presentDays = await Attendance.countDocuments({ uID, status: 'Present' });
        // const lateDays = await Attendance.countDocuments({uID, status: 'Late'});
        const absentDays = await Attendance.countDocuments({
            uID,
            $or: [{ status: 'Absent' }, { status: 'Late' }]
        });

        console.log("Attendance Calculated Successfully");
        res.status(200).json({
            success: true,
            data: {
                totalDays,
                presentDays,
                // lateDays,
                absentDays
            },
            message: 'Attendance summary calculated successfully'
        });
    } catch (err) {
        console.log("Error calculating the Attendance");
        res.status(500).json({
            success: false,
            err: err.message,
            message: 'Error calculating attendance'
        });
    }

}


// Function to add or update salary details
exports.addOrUpdateSalary = async (req, res) => {
    try {
        const { uID, name, role, email, baseSalary, bonus, deductions } = req.body;

        // Calculate net salary
        const netSalary = baseSalary + bonus - deductions;

        // Find existing salary record by uID
        let salary = await Salary.findOne({ uID });

        if (salary) {
            // Update existing record
            salary.baseSalary = baseSalary;
            salary.bonus = bonus;
            salary.deductions = deductions;
            salary.netSalary = netSalary;
        } else {
            // Create new salary record
            salary = new Salary({
                uID,
                name,
                role,
                email,
                baseSalary,
                bonus,
                deductions,
                netSalary
            });
        }

        const response = await salary.save();
        res.status(200).json({
            success: true,
            data: response,
            message: 'Salary record saved successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message,
            message: 'Error saving salary record'
        });
    }
};

// Function to view an employee’s salary details
exports.viewSalary = async (req, res) => {
    try {
        const { uID } = req.params;
        const salary = await Salary.findOne({ uID });

        if (!salary) {
            return res.status(404).json({
                success: false,
                message: 'Salary record not found for the specified employee'
            });
        }

        console.log("Salary record retrieved successfully");
        res.status(200).json({
            success: true,
            data: salary,
            message: 'Salary record retrieved successfully'
        });
    } catch (error) {
        console.log("Error retrieving salary record");
        res.status(500).json({
            success: false,
            error: error.message,
            message: 'Error retrieving salary record'
        });
    }
};

// Function to calculate Tasks
exports.calculateTask = async (req, res) => {

    try {
        const { labourID } = req.params;
        const totalTasks = await Task.countDocuments({ labourID });
        const compltedTasks = await Task.countDocuments({ labourID, status: 'Completed' });
        const pendingTasks = await Task.countDocuments({ labourID, status: 'Pending' });

        console.log("Tasks Calculated Successfully");
        res.status(200).json({
            success: true,
            data: {
                totalTasks,
                compltedTasks,
                pendingTasks
            },
            message: 'Task summary calculated successfully'
        });
    } catch (err) {
        console.log("Error calculating the Tasks");
        res.status(500).json({
            success: false,
            err: err.message,
            message: 'Error calculating Tasks'
        });
    }

}