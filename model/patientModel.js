const mongoose= require('mongoose');
const Schema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    age: Number,
    gender: String,
    city: String,
    phone: Number,

})
module.exports = mongoose.model('Patient', Schema)