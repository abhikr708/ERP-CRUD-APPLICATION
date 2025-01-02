const mongoose = require('mongoose');

// Create new Labour Schema
const labourSchema = new mongoose.Schema(
    {

        uID: {
            type: Number,
            required: true,
            unique: true
        },
        name: {
            type: String,
            required: true
        },
        assignedSalesManager: {
            type: String, // this has to be changed
            required: true
        },
        area: {
            type: String,
            enum: ['Noida', 'Delhi', 'Greater Noida'],
            required: true
        },
        inTime: {
            type: Date,
            default: null
        },
        outTime: {
            type: Date,
            default: null
        },
        tasks: [
            {
                taskID: { type: Number, required: true },
                taskDescription: { type: String, required: true },
                status: {
                    type: String,
                    enum: ['Pending', 'Partially Completed', 'Completed'],
                    default: 'Pending'
                },
                assignedDate: { type: Date, default: Date.now },
                completionDate: { type: Date }
            }
        ],
    }
);

// export the schema
const Labour = mongoose.model('Labour', labourSchema);
module.exports = Labour;