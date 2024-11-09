const express = require('express');
const router = express.Router();
const labourController = require('../controllers/labourController');

const { viewTasks } = labourController; 

router.get('/viewTasks/:labourID', viewTasks);

module.exports = router;