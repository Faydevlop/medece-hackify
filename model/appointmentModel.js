const mongoose = require("mongoose");
const Schema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Patient",
    },
    doctorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Doctor",
    },
    dateTime: {
        type: Date,
        required: true,
    },
    status: {
        type: Boolean,
        default: false,
    },
})
module.exports = mongoose.model("appointment", Schema)