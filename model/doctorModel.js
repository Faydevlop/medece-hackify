const mongoose=require('mongoose')
const Schema = new mongoose.Schema({
    name: String,
    specialization: String,
    experience: Number,
    fees: Number,
    image: String,
    description: String,
    address: String,
    timings: String,
    phone: String,
    email: String,
    city:String,
    password: String,
    isVerified: Boolean,
    isBlocked: Boolean,
    
})
module.exports = mongoose.model('Doctor', Schema)