// import the database schema
const Labour = require('../models/Labour');
const User = require('../models/User');
const {generateToken} = require('../jwt');

// Function to sign up sales manager
exports.salesManagerSignup = async (req, res)=>{
    try{
        const data = req.body // Assuming the request body contains the person data
        const {uID, password} = data;
        // if(! await checkUserID(uID))
        //     return res.status(403).json({message:'This User ID is not available in our database. Please contact your admin to get your User ID'});
        
        const user = await User.findOne({uID: uID});
        if(!user) 
            return res.status(403).json({message:'This User ID is not available in our database. Please contact your admin to get your User ID'});
        
        // extract the area form the user
        const area = user.area;

        // save the password of the user
        user.password = password;

        // Save the new person to the database
        const response = await user.save();
        console.log('data saved');
        
        // Generating the token using payload (username)
        const payload = {
            uID: response.uID,
            area: area
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


// Function to login salesManager
exports.salesManagerLogin = async(req, res)=>{
    try {
        // Extract the aaddharNumber and password from the request body
        const { uID, password } = req.body;

        // Find the user by aadharNumber
        const user = await User.findOne({ uID: uID });

        // If the user does not exist or the password is invalid, return error
        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ error: "Invalid username or password" });
        }
        // extract the area form the user
        const area = user.area;

        // generate token
        const payload = {
            uID: user.uID,
            area: area
        };
        const token = generateToken(payload);

        // return token as response 
        res.json({ token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

// Function to find labours within the Sales Manager Area
exports.manageLabours = async (req, res) => {
    try {
        // get the area of the Sales manager from the user input
        const area = await req.userPayload.area;
        // console.log("Area is ", area);
        // find the labours who belongs within the sales manager area
        const labours = await Labour.find({ area: area });

        if (!labours) {
            console.log("No labour found");
        }

        // Eclude unnecessary data from the response   
        const response = labours.map(labour =>({
            uID: labour.uID,
            name: labour.name,
            assignedSalesManager: labour.assignedSalesManager,  
            area: labour.area 
        }));
        console.log("Data fetched Successfully");
        res.status(200).json({
            success: true,
            data: response,
            message: "Data fetched Successfully"
        });
    } catch (err) {
        console.log("Failed to fetch data");
        res.status(500).json({
            success: false,
            data: err.message,
            message: "Internal server error",
        })
    }
}

// Function to add a new labour
exports.addNewLabour = async (req, res) => {
    try {
        // get the data from the request body
        const { uID, name, assignedSalesManager, area, email } = req.body;
        // create a new labour object
        const newLabour = new Labour({ uID, name, assignedSalesManager, area });
        const newUser = new User({
            uID, 
            name, 
            role:'Labour',
            email,
            area
        });
        // save the new labour to the labour database
        const response = await newLabour.save();
        await newUser.save();
        console.log('Data saved successfully');
        res.status(200).json({
            success: true,
            data: response,
            message: "Labour datails saved successfully"
        });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({
            success: false,
            data: err.message,
            message: "Internal Server Error"
        });
    }
}

// Function to add or update task
exports.addOrUpdateTask = async (req, res) => {
    try {
        const { labourID } = req.params;
        const { taskDescription, taskID, assignedOn, status, completionDate } = req.body;

        // Find existing labour record
        let labour = await Labour.findOne({ uID: labourID });

        if (!labour) {
            return res.status(404).json({ message: 'Labour not found' });
        }

        // Find existing task
        let task = labour.tasks.find(task => task.taskID === taskID);

        if (task) {
            // Update existing task
            task.taskDescription = taskDescription;
            task.assignedOn = assignedOn;
            task.status = status;
            task.completionDate = completionDate;
        } else {
            // Add new task
            labour.tasks.push({
                taskID,
                taskDescription,
                assignedOn,
                status,
                completionDate
            });
        }

        // Save the updated labour record
        await labour.save();

        res.status(200).json({ message: 'Task added/updated successfully' });
    } catch (error) {
        res.status(500).json({
            message: 'Error adding/updating task',
            error: error.message
        });
    }
};