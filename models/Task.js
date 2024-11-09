const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    labourID:{
        type:Number,
        required: true,
    },
    taskID:{
        type:Number,
        required:true,
        unique: true
    },
    taskDescription:{
        type:String,
        require: true,
    },
    assignedOn:{
        type: Date,
        default: null
    },
    status:{
        type:String,
        enum:['Pending', 'Completed'],
        default: "Pending"
    },
    completionDate:{
        type:Date,
        default: null
    }

})

const Task = mongoose.model('Task', taskSchema);
module.exports = Task;