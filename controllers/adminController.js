const User = require('../models/User');  // Assuming Sales Managers and Labours are stored in the User model
const Labour = require('../models/Labour');

// Function to add a new Sales Manager
exports.addSalesManager = async (req, res) => {
    try {
        const { uID, name, email, password, area } = req.body;
        const newSalesManager = new User({
            uID,
            name,
            email,
            password,
            role: 'SalesManager',
            area
        });

        const response = await newSalesManager.save();
        console.log("Sales manager added successfully");
        res.status(201).json({
            success: true,
            data: response,
            message: "Sales Manager added successfully"
        });
    } catch (error) {
        console.log("Error adding Sales Manager");
        res.status(500).json({
            success: false,
            error: error.message,
            message: "Error adding Sales Manager"
        });
    }
};

// Function to add a new Labour
exports.addLabour = async (req, res) => {
    try {
        const { uID, name, assignedSalesManager, area } = req.body;
        const newLabour = new Labour({
            uID,
            name,
            assignedSalesManager,
            area
        });

        const response = await newLabour.save();
        console.log("Labour added successfully");
        res.status(201).json({
            success: true,
            data: response,
            message: "Labour added successfully"
        });
    } catch (error) {
        console.log("Error adding Labour");
        res.status(500).json({
            success: false,
            error: error.message,
            message: "Error adding Labour"
        });
    }
};

// Function to get all Sales Managers
exports.getAllSalesManagers = async (req, res) => {
    try {
        const salesManagers = await User.find({ role: 'SalesManager' });
        res.status(200).json({
            success: true,
            data: salesManagers,
            message: "Sales Managers retrieved successfully"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message,
            message: "Error retrieving Sales Managers"
        });
    }
};

// Function to get all Labours
exports.getAllLabours = async (req, res) => {
    try {
        const labours = await Labour.find();
        res.status(200).json({
            success: true,
            data: labours,
            message: "Labours retrieved successfully"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message,
            message: "Error retrieving Labours"
        });
    }
};

// Function to delete a Sales Manager by ID
exports.deleteSalesManager = async (req, res) => {
    try {
        const { uID } = req.params;
        const result = await User.deleteOne({uID:uID});
        console.log("Sales manager deleted successfully");
        res.status(200).json({
            success: true,
            data: result,
            message: "Sales Manager deleted successfully"
        });
    } catch (err) {
        console.log("Error deleting the Sales manager");
        res.status(500).json({
            success: false,
            error: err.message,
            message: "Error deleting Sales Manager"
        });
    }
};

// Function to delete a Labour by ID
exports.deleteLabour = async (req, res) => {
    try {
        const { uID } = req.params;
        const response = await Labour.deleteOne({uID:uID});
        res.status(200).json({
            success: true,
            data: response,
            message: "Labour deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message,
            message: "Error deleting Labour"
        });
    }
};

// Function to view Sales Manager and Labour locations
exports.viewLocations = async (req, res) => {
    try {
        const salesManagers = await User.find({ role: 'SalesManager' }).select('uID name area role');
        const labours = await Labour.find().select('uID name area role');
        
        res.status(200).json({
            success: true,
            data: { salesManagers, labours },
            message: "Locations retrieved successfully"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message,
            message: "Error retrieving locations"
        });
    }
};
