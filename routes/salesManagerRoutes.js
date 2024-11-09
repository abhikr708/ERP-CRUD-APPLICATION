const express = require('express');
const router = express.Router();

// import the modules from the controller
const { manageLabours, addNewLabour, trackInTime, trackOutTime, addOrUpdateTask} = require("../controllers/salesManagerController");

// creating the routes
router.get("/manageLabours/:area", manageLabours);
router.post('/addNewLabour', addNewLabour);
router.post('/trackInTime/:uID', trackInTime);
router.post('/trackOutTime/:uID', trackOutTime);
router.post('/addOrUpdateTask/:labourID', addOrUpdateTask);

module.exports = router;