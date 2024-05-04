const mongoose = require("mongoose");
const Schema = new mongoose.Schema({
    name: String,
    address: String,
    phone: String,
    email: String,
    password: String,
    image:{
        type: String,
        required:false
    },
    date: { type: Date, default: Date.now },      
})
module.exports = mongoose.model("Hostpital", Schema)