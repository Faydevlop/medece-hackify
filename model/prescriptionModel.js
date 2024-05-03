const mongoose = require("mongoose");
const Schema = new mongoose.Schema(
    {
        image: {
            type: String,
            require: true,
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Patient",
        },
        doctorId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Doctor",
        },
        comment:{
            type:String
        }
    },
    { timestamps: true }
)
module.exports = mongoose.model("prescription",Schema)