const Task = require('../models/Task');

// View all tasks for a specific labour
exports.viewTasks = async (req, res) => {
    try {
        const {labourID} = req.params;

        const task = await Task.find({labourID:labourID});
        if (!task) {
            return res.status(404).json({ message: 'Labour not found' });
        }
        console.log("Task data retrieved successfully");
        res.status(200).json({
            success: true,
            data: task,
            message: 'Tasks retrieved successfully'
        });
    } catch (error) {
        console.log("Error retrieving tasks");
        res.status(500).json({
            success: false,
            error: error.message,
            message: 'Error retrieving tasks'
        });
    }
};
