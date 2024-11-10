const express = require('express');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.json());
const dbConnect = require('./config/db');

// Authentication
const passport = require('./auth');
// const LocalStrategy =  require('passport-local').Strategy;

// Load the config from env
require('dotenv').config();
const PORT = process.env.PORT || 4000;

// Middleware Function
const logRequest = (req, res, next)=>{
    console.log(`${new Date().toLocaleString()}, Request Made to: ${req.originalUrl}`);
    next(); // move to the next phase
}
app.use(logRequest);

// Intialize the passport
app.use(passport.initialize());
const localAuthMiddleWare = passport.authenticate('local', {session:false});


// Establish connection to the database
dbConnect();

// _______Routes_______

app.get('/', localAuthMiddleWare, (req, res)=>{
    res.send("WELCOME....");
})

// Sales Manager Routes
const salesManagerRoutes = require('./routes/salesManagerRoutes');
app.use('/salesManager', salesManagerRoutes);

// Admin routes
const adminRoutes = require('./routes/adminRoutes');
app.use('/admin', adminRoutes);

// HR routes
const hrRoutes = require('./routes/hrRoutes');
app.use('/hr', hrRoutes);

// Labour routes
const labourRoutes = require('./routes/labourRoutes');
app.use('/labour', labourRoutes);

// Listen to the port
app.listen(PORT, ()=>{
    console.log(`Server started at PORT ${PORT}`)
});