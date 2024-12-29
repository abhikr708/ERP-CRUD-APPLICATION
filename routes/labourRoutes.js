const express = require('express');
const router = express.Router();
const labourController = require('../controllers/labourController');
const {jwtAuthMiddleware} = require('../jwt');

const { viewTasks, labourSignup, labourLogin } = labourController; 

router.post('/signup', labourSignup);
router.post('/login', labourLogin);
router.get('/viewTasks', jwtAuthMiddleware, viewTasks);

module.exports = router;