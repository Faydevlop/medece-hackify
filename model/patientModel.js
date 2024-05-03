const mongoose= require('mongoose');
const Schema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    age: Number,
    gender: String,
    address: String,
    phone: Number,
    image: String,

})
module.exports = mongoose.model('Patient', Schema)