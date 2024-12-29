const User = require('../models/User');  // Assuming Sales Managers and Labours are stored in the User model
const Labour = require('../models/Labour');
const Admin = require('../models/Admin');
const {generateToken} = require('../jwt');

// Function to signup admin
exports.adminSignup = async (req, res)=>{
    try{
        const data = req.body // Assuming the request body contains the person data

        // Create a new Person document using the Mongoose model
        const newUser = new Admin(data);

        // Save the new person to the database
        const response = await newUser.save();
        console.log('data saved');
        
        // Generating the token using payload (username)
        const payload = {
            adminID: response.adminID,
        }
        console.log(JSON.stringify(payload));
        const token = generateToken(payload);
        console.log("Token is : ", token);

        res.status(200).json({response: response, token: token});
    }
    catch(err){
        console.log(err);
        res.status(500).json({error: 'Internal Server Error'});
    }
}

// Function to login admin
exports.adminLogin = async (req, res) => {
    try {
        // Extract the aaddharNumber and password from the request body
        const { adminID, password } = req.body;

        // Find the user by aadharNumber
        const user = await Admin.findOne({ adminID: adminID });

        // If the user does not exist or the password is invalid, return error
        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ error: "Invalid username or password" });
        }

        // generate token
        const payload = {
            adminID: user.adminID
        };
        const token = generateToken(payload);

        // return token as response 
        res.json({ token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

// Function to add a new Sales Manager
exports.addSalesManager = async (req, res) => {
    try {
        const { uID, name, email, area } = req.body;
        const newSalesManager = new User({
            uID,
            name,
            email,
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
        const { uID, name, assignedSalesManager, area, email, password} = req.body;
        const newLabour = new Labour({
            uID,
            name,
            assignedSalesManager,
            area
        });

        const newUser = new User({
            uID, 
            name, 
            role:'Labour',
            email,
            area
        });

        const response = await newLabour.save();
        await newUser.save();
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
        const result = await User.deleteOne({ uID: uID });
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
        const response = await Labour.deleteOne({ uID: uID });
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
