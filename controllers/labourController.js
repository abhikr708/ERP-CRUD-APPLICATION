const { findOne } = require('../models/Labour');
const Task = require('../models/Task');
const User = require('../models/User');
const {generateToken} = require('../jwt');

// // Function to check the user id
// const checkUserID = async(uID)=>{
//     try{
//         const user = await User.findOne({uID:uID});
//         if(!user) return false;
//         return true;
//     }catch(err){
//         return false;
//     }
// }

// Function to sign up labour 
exports.labourSingnup = async (req, res)=>{
    try{
        const data = req.body // Assuming the request body contains the person data
        const {uID, password} = data;
        // if(! await checkUserID(uID))
        //     return res.status(403).json({message:'This User ID is not available in our database. Please contact your admin to get your User ID'});
        
        const user = await User.findOne({uID: uID});
        if(!user) 
            return res.status(403).json({message:'This User ID is not available in our database. Please contact your admin to get your User ID'});
        
        // save the password of the user
        user.password = password;

        // Save the new person to the database
        const response = await user.save();
        console.log('data saved');
        
        // Generating the token using payload (username)
        const payload = {
            uID: response.uID,
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


// Function to login labour
exports.labourLogin = async(req, res)=>{
    try {
        // Extract the aaddharNumber and password from the request body
        const { uID, password } = req.body;

        // Find the user by aadharNumber
        const user = await User.findOne({ uID: uID });

        // If the user does not exist or the password is invalid, return error
        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ error: "Invalid username or password" });
        }

        // generate token
        const payload = {
            uID: user.uID
        };
        const token = generateToken(payload);

        // return token as response 
        res.json({ token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal Server Error" });
    }
}


// View all tasks for a specific labour
exports.viewTasks = async (req, res) => {
    try {
        const labourID = req.userPayload.uID;
        console.log(labourID);

        const task = await Task.find({labourID:labourID});
        if (!task) {
            return res.status(404).json({ message: 'Labour not found' });
        }
        console.log("Task data retrieved successfully");
        res.status(200).json({
            success: true,
            data: task,
            message: 'Tasks retrieved successfully'
        });
    } catch (error) {
        console.log("Error retrieving tasks");
        res.status(500).json({
            success: false,
            error: error.message,
            message: 'Error retrieving tasks'
        });
    }
};
