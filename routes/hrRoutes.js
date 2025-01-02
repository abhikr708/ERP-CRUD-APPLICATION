const express = require('express');
const router = express.Router();
const hrController = require('../controllers/hrController');
const {jwtAuthMiddleware} = require('../jwt');
const { salesManagerLogin } = require('../controllers/salesManagerController');

// Import the modules
const { hrSignup, hrLogin, manageLabours, manageSalesManagers ,recordAttendance, calculateAttendance, addOrUpdateSalary, viewSalary, calculateTask} = hrController

// Route to SignUp hr
router.post('/hrSignup', hrSignup);

// Route to Login HR
router.post('/hrLogin', hrLogin); 

// Route to get labours information
router.get('/manageLabours', jwtAuthMiddleware, manageLabours);

// Route to get salesMangers
router.get('/manageSalesManagers', jwtAuthMiddleware, manageSalesManagers);

// Route to mark attendace 
router.post('/recordAttendance', jwtAuthMiddleware, recordAttendance)

// Route to calculate attendance of an employee
router.get('/calculateAttendance/:uID', jwtAuthMiddleware, calculateAttendance);

// Route to add or update salary details for an employee
router.post('/addOrUpdateSalary', jwtAuthMiddleware, addOrUpdateSalary);

// Route to view an employee’s salary details by uID
router.get('/viewSalary/:uID', jwtAuthMiddleware, viewSalary);

// Route to calculate the total tasks of the labour
router.get('/calculateTask/:labourID', jwtAuthMiddleware, calculateTask);

module.exports = router;
