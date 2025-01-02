const express = require('express');
const router = express.Router();
const {jwtAuthMiddleware} = require('../jwt');

const {
    adminSignup,
    adminLogin,
    addSalesManager,
    addHr,
    addLabour,
    getAllSalesManagers,
    getAllLabours,
    deleteSalesManager, // Confirm this matches the export name
    deleteLabour, // Confirm this matches the export name
    viewLocations
} = require('../controllers/adminController');

// Route to signup admin
router.post('/signup', adminSignup);

//  Route to login admin
router.post('/login', adminLogin);

// Route to add a Sales Manager
router.post('/addSalesManager', jwtAuthMiddleware, addSalesManager); // runs

// Route to add an HR
router.post('/addHr', jwtAuthMiddleware, addHr); // runs

// Route to add a Labour
router.post('/addLabour',jwtAuthMiddleware, addLabour); // runs

// Route to get all Sales Managers
router.get('/getAllSalesManagers',jwtAuthMiddleware, getAllSalesManagers); // runs

// Route to get all Labours
router.get('/getAllLabours',jwtAuthMiddleware, getAllLabours); //runs

// Route to delete a Sales Manager by ID  
router.delete('/deleteSalesManager/:uID', jwtAuthMiddleware, deleteSalesManager);  //runs

// Route to delete a Labour by ID
router.delete('/deleteLabour/:uID',jwtAuthMiddleware, deleteLabour); // 

// Route to view locations of Sales Managers and Labours
router.get('/viewLocations', jwtAuthMiddleware, viewLocations); //runs

module.exports = router;
