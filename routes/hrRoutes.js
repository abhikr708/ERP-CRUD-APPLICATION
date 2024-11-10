const express = require('express');
const router = express.Router();
const hrController = require('../controllers/hrController');

// Import the modules
const {recordAttendance, calculateAttendance, addOrUpdateSalary, viewSalary, calculateTask} = hrController

// Route to mark attendace 
router.post('/recordAttendance', recordAttendance)

// Route to calculate attendance of an employee
router.get('/calculateAttendance/:uID', calculateAttendance);

// Route to add or update salary details for an employee
router.post('/addOrUpdateSalary', addOrUpdateSalary);

// Route to view an employee’s salary details by uID
router.get('/viewSalary/:uID', viewSalary);

// Route to calculate the total tasks of the labour
router.get('/calculateTask/:labourID', calculateTask);

module.exports = router;
