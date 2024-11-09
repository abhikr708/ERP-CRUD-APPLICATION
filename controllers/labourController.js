const Task = require('../models/Task');

// Update the status of a specific task for a labour
exports.updateTaskStatus = async (req, res) => {
    try {
        const { uId, taskId } = req.params;
        const { status } = req.body;

        const labour = await Task.findById(uId);
        if (!labour) {
            return res.status(404).json({ message: 'Labour not found' });
        }

        // Find the task by taskId within the tasks array
        const task = labour.tasks.id(taskId);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        task.status = status;
        if (status === 'Completed') {
            task.completionDate = new Date();
        }

        await labour.save();
        res.status(200).json({
            success: true,
            data: task,
            message: 'Task status updated successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message,
            message: 'Error updating task status'
        });
    }
};

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
