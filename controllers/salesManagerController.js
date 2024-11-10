// import the database schema
const Labour = require('../models/Labour');
const User = require('../models/User');
const Task = require("../models/Task");

// Function to find labours within the Sales Manager Area
exports.manageLabours = async (req, res) => {
    try {
        // get the area of the Sales manager from the user input
        const { area } = req.params;
        // find the labours who belongs within the sales manager area
        const labours = await Labour.find({ area });

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

// Function to add a new labour
exports.addNewLabour = async (req, res) => {
    try {
        // get the data from the request body
        const { uID, name, assignedSalesManager, area } = req.body;
        // create a new labour object
        const newLabour = new Labour({ uID, name, assignedSalesManager, area });
        // save the new labour to the labour database
        const response = await newLabour.save();
        console.log('Data saved successfully');
        res.status(200).json({
            success: true,
            data: response,
            message: "Labour datails saved successfully"
        });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({
            success: false,
            data: err.message,
            message: "Internal Server Error"
        });
    }
}

// Function to track the in time of the labour
exports.trackInTime = async (req, res) => {
    try {
        const { uID } = req.params; // Get the labour ID from the request
        const labour = await Labour.findOne({ uID });

        if (!labour) {
            console.log("Error 404, Labour not found")
            return res.status(404).json({ message: 'Labour not found' });
        }

        // Set in-time to the current date and time
        labour.inTime = new Date();
        const response = await labour.save();

        res.status(200).json({
            message: 'In-time recorded successfully',
            inTime: response.inTime
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error recording in-time',
            error: error.message
        });
    }
};

// Function to track the out time of the labour
exports.trackOutTime = async (req, res) => {
    try {
        const { uID } = req.params; // Get the labour ID from the request
        const labour = await Labour.findOne({ uID });

        if (!labour) {
            return res.status(404).json({ message: 'Labour not found' });
        }

        // Set out-time to the current date and time
        labour.outTime = new Date();
        const response = await labour.save();

        res.status(200).json({
            message: 'Out-time recorded successfully',
            outTime: response.outTime
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error recording out-time',
            error: error.message
        });
    }
};


// Function to add task
exports.addOrUpdateTask = async (req, res) => {
    try {
        const { labourID } = req.params;
        const { taskDescription, taskID, assignedOn, status, completionDate } = req.body;

        // Find existing task record
        let task = await Task.findOne({ taskID });

        if (task) {
            // Update existing task
            task.taskDescription = taskDescription,
                task.assignedOn = assignedOn,
                task.status = status,
                task.completionDate = completionDate
        }
        else {
            // Create a new task
            task = new Task({
                labourID,
                taskDescription,
                taskID,
                assignedOn,
                status,
                completionDate
            });
        }

        const response = await task.save();
        console.log("Task added successfully");
        res.status(200).json({
            success: true,
            data: response,
            message: 'Task added successfully'
        });
    } catch (error) {
        console.log("Error addding the task");
        res.status(500).json({
            success: false,
            error: error.message,
            message: 'Error adding the task'
        });
    }
}