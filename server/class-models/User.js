const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    email: { type: String, unique: true},
    password: { type: String},
    role: { type: String},
    phone: String,
    firstName: String,
    lastName: String,
    address: String,
    empId: {type: String, unique: true}
});

module.exports = mongoose.model('User', userSchema);