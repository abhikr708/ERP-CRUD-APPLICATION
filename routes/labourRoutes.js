const express = require('express');
const router = express.Router();
const labourController = require('../controllers/labourController');
const {jwtAuthMiddleware} = require('../jwt');

const { viewTasks, labourSingnup, labourLogin } = labourController; 

router.post('/signup', labourSingnup);
router.post('/login', labourLogin);
router.get('/viewTasks', jwtAuthMiddleware, viewTasks);

module.exports = router;