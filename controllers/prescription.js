const prescriptionModel = require('../model/prescriptionModel');
// adding prescription image to prescription model
const uploadingPrescriptionImage = async (req, res) => {
    try {
        const prescription = new prescriptionModel({
            image: req.file.filename
        })
        await prescription.save();
        res.status(200).json({ message: 'prescription uploaded successfully' });
    } catch (error) {
        console.log(error);
    }
}

// getiing prescription by the user
const getPrescriptionByUser = async (req, res) => {
     try {
        const prescription = await prescriptionModel.find({ user: req.user._id });
        res.render('prescription', {prescription})
     } catch (error) {
        console.log(error)
     }
}
//getting all users prescription by the doctor 
const getAllPrescription = async (req, res) => {
    try {
        const prescriptions = await prescriptionModel.find();
        res.render('allPrescription', {prescriptions})
    } catch (error) {
        console.log(error)
    }
}
// doctor adding comment to the particular description
const doctorAddingComment = async (req, res) => {
    try {
        const prescriptionId= req.params.id
        const comment = req.body.comment
       await prescriptionModel.findByIdAndUpdate(
           prescriptionId,
           { $set: { comment } },
           { new: true } 
       )
        res.json({ message: 'comment added successfully' })
    } catch (error) {
        console.log(error)
    }
}
module.exports={
    uploadingPrescriptionImage,
    getPrescriptionByUser,
    getAllPrescription,
    doctorAddingComment
}