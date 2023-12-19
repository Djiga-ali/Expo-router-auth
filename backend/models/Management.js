const mongoose = require("mongoose");

const managementSchema = new mongoose.Schema({});

module.exports = mongoose.model("Management", managementSchema);

// {
//     first_name: "First name",
//     last_name: "Last name",
//     //
//     assignments: [
//         { company:"Aperture Science", branch:"R&D", position:"test subject" },
//         { company:"Black Mesa", branch:"security", position:"leader of blue shift" }
//     ]
// }

// EMPLOYEES
// // defining the schema which will be used to save the data
// var employeeSchema =new mongoose.Schema({
//     name: String,
//     email: String,
//     location: String,
//     phone: Number,
//     title: String,
//     address: String,
//     age: Number,
//     gender: String,
//     salary: Number
// })

// //defining model
// var employeeModel = mongoose.model('addEmployee', employeeSchema);
