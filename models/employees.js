// Import Dependencies
const mongoose = require("mongoose")


// Creating Schema for employees
const employeesSchema = new mongoose.Schema({
    user:{
        type : mongoose.Schema.Types.ObjectId,
        ref : "User"
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    position: {
        type: String,
        required: true
    }
});


// Creating employees Models
const Employees = mongoose.model('Employees', employeesSchema);

// Export Modules
module.exports = Employees;