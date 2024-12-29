const express = require('express');
const router = express.Router();
const {jwtAuthMiddleware} = require('../jwt');

// import the modules from the controller
const {salesManagerSignup, salesManagerLogin, manageLabours, addNewLabour, trackInTime, trackOutTime, addOrUpdateTask} = require("../controllers/salesManagerController");

// creating the routes
router.post("/salesManagerSignup", salesManagerSignup);
router.post("/salesManagerLogin", salesManagerLogin);
router.get("/manageLabours", jwtAuthMiddleware, manageLabours);
router.post('/addNewLabour', jwtAuthMiddleware, addNewLabour);
router.post('/trackInTime/:uID', jwtAuthMiddleware, trackInTime);
router.post('/trackOutTime/:uID', jwtAuthMiddleware, trackOutTime);
router.post('/addOrUpdateTask/:labourID', jwtAuthMiddleware, addOrUpdateTask);

module.exports = router;