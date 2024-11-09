const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

const {
    addSalesManager,
    addLabour,
    getAllSalesManagers,
    getAllLabours,
    deleteSalesManager, // Confirm this matches the export name
    deleteLabour, // Confirm this matches the export name
    viewLocations
} = require('../controllers/adminController');

// Route to add a Sales Manager
router.post('/addSalesManager', addSalesManager); // runs

// Route to add a Labour
router.post('/addLabour', addLabour); // runs

// Route to get all Sales Managers
router.get('/getAllSalesManagers', getAllSalesManagers); // runs

// Route to get all Labours
router.get('/getAllLabours', getAllLabours); //runs

// Route to delete a Sales Manager by ID  
router.delete('/deleteSalesManager/:uID', deleteSalesManager);  //runs

// Route to delete a Labour by ID
router.delete('/deleteLabour/:uID', deleteLabour); // 

// Route to view locations of Sales Managers and Labours
router.get('/viewLocations', viewLocations); //runs

module.exports = router;
