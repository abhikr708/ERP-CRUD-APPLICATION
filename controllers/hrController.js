const Attendance = require('../models/Attendance');
const Salary = require('../models/Salary');
const User = require('../models/User');
const Labour = require('../models/Labour');
const mongoose = require('mongoose');
const { generateToken } = require('../jwt');

// Function to SignUp HR 
exports.hrSignup = async (req, res) => {
    try {
        const data = req.body // Assuming the request body contains the person data
        const { uID, password } = data;
        // if(! await checkUserID(uID))
        //     return res.status(403).json({message:'This User ID is not available in our database. Please contact your admin to get your User ID'});

        const user = await User.findOne({ uID: uID });
        if (!user)
            return res.status(403).json({ message: 'This User ID is not available in our database. Please contact your admin to get your User ID' });

        // extract the area form the user
        const area = user.area;

        // save the password of the user
        user.password = password;

        // Save the new person to the database
        const response = await user.save();
        console.log('data saved');

        // Generating the token using payload (username)
        const payload = {
            uID: response.uID,
            area: area
        }
        console.log(JSON.stringify(payload));
        const token = generateToken(payload);
        console.log("Token is : ", token);

        res.status(200).json({ response: response, token: token });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}


// Function to login salesManager
exports.hrLogin = async (req, res) => {
    try {
        // Extract the aaddharNumber and password from the request body
        const { uID, password } = req.body;

        // Find the user by aadharNumber
        const user = await User.findOne({ uID: uID });

        // If the user does not exist or the password is invalid, return error
        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ error: "Invalid username or password" });
        }
        // extract the area form the user
        const area = user.area;

        // generate token
        const payload = {
            uID: user.uID,
            area: area
        };
        const token = generateToken(payload);

        // return token as response 
        res.json({ token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

// Function to get the labour infomation of HR's Area
exports.manageLabours = async (req, res) => {
    try {
        // get the area of the Sales manager from the user input
        const area = await req.userPayload.area;
        // console.log("Area is ", area);
        // find the labours who belongs within the sales manager area
        const labours = await Labour.find({ area: area });

        if (!labours) {
            console.log("No labour found");
        }

        console.log("Data fetched Successfully");
        res.status(200).json({
            success: true,
            data: labours,
            message: "Data fetched Successfully"
        });
    } catch (err) {
        console.log("Failed to fetch data");
        res.status(500).json({
            success: false,
            data: err.message,
            message: "Internal server error",
        })
    }
}

// Function to get the SalesManagers of HR's Area
exports.manageSalesManagers = async (req, res) => {
    try {
        // get the area of the Sales manager from the user input
        const area = await req.userPayload.area;
        console.log("Area is ", area);
        // find the labours who belongs within the sales manager area
        const salesManagers = await User.find({ area: area, role: 'SalesManager' });

        if (!salesManagers || salesManagers.length === 0) {
            console.log("No Sales MNanager found");
        }

        // Exclude password from the response
        const salesManagersWithoutPassword = salesManagers.map(manager => ({
            uID: manager.uID,
            name: manager.name,
            area: manager.area,
            email: manager.email,
            role: manager.role
        }));

        console.log("Data fetched Successfully");
        res.status(200).json({
            success: true,
            data: salesManagersWithoutPassword,
            message: "Data fetched Successfully"
        });
    } catch (err) {
        console.log("Failed to fetch data");
        res.status(500).json({
            success: false,
            data: err.message,
            message: "Internal server error",
        })
    }
}

// Function to mark attendance of the employees
exports.recordAttendance = async (req, res) => {
    try {
        const { uID, date, status } = req.body;

        // Find the attendance record for the user
        let attendance = await Attendance.findOne({ uID });

        if (!attendance) {
            // If no attendance record exists, create a new one
            const user = await mongoose.model('User').findOne({ uID });
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            attendance = new Attendance({
                uID: user.uID,
                name: user.name,
                email: user.email,
                role: user.role,
                attendance: []
            });
        }

        // Add or update the attendance for the given date
        const existingAttendance = attendance.attendance.find(att => att.date.toISOString().split('T')[0] === new Date(date).toISOString().split('T')[0]);

        if (existingAttendance) {
            existingAttendance.status = status;
        } else {
            attendance.attendance.push({ date, status });
        }

        await attendance.save();

        res.status(200).json({ message: 'Attendance recorded successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error recording attendance', error: error.message });
    }
};

// Function to calculate attendance
exports.calculateAttendance = async (req, res) => {
    try {
        const { uID } = req.params;
        const user = await Attendance.findOne({ uID });
        if (!user) {
            res.status(404).json({message: 'User not found'});
        }

        const totalDays = user.attendance.length;
        const presentDays = user.attendance.filter(day => day.status === 'Present').length;
        const absentDays = user.attendance.filter( day=> day.status==='Absent').length;

        console.log("Attendance Calculated Successfully");
        res.status(200).json({
            success: true,
            data: {
                totalDays,
                presentDays,
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

        const labour = await Labour.findOne({ uID: labourID });
        if (!labour) {
            return res.status(404).json({ message: 'Labour not found' });
        }

        // Calculate the task statistics
        const totalTasks = labour.tasks.length;
        const completedTasks = labour.tasks.filter(task => task.status === 'Completed').length;
        const pendingTasks = labour.tasks.filter(task => task.status === 'Pending').length;

        console.log("Tasks Calculated Successfully");
        res.status(200).json({
            success: true,
            data: {
                totalTasks,
                completedTasks,
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