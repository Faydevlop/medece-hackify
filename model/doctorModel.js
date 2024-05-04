const mongoose=require('mongoose')
const Schema = new mongoose.Schema({
    name: String,
    specialization: String,
    experience: Number,
    image:{
        type:String,
        required:false
    },
    description: String,
    address: String,
    timings:{
        type:String,
        required:fa

    },
    phone: String,
    email: String,
    city:String,
    password: String,
    // isVerified: Boolean,
    // isBlocked: Boolean,
    
})
module.exports = mongoose.model('Doctor', Schema)