const mongoose = require("mongoose");
const Schema = new mongoose.Schema({
    image:{
        type:String,
        require:true
    }
})
module.exports = mongoose.model("prescription",Schema)