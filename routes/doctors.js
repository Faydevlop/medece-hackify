var express = require("express")
var router = express.Router()
var session = require("express-session")
var Doctor = require("../model/doctorModel")
const doctorModel = require("../model/doctorModel")
const appointmentModel = require("../model/appointmentModel")
const prescriptionModel= require("../model/prescriptionModel")

router.use(
    session({
        secret: "doctor", 
        resave: false,
        saveUninitialized: true,
    })
)

/* GET login page. */
router.get("/login", function (req, res, next) {
  try {
    res.render("doctor/login")
  } catch (error) {
    console.log(error)
  }
    
})

// get doctor register page
router.get("/register", function (req, res, next) {
  try {
     res.render("doctor/register")
  } catch (error) {
     console.log(error) 
  }
   
})

// get doctor profile page
router.get("/profile", function (req, res, next) {
   try {
      res.render("doctor/doctor-dashboard")
   } catch (error) {
      console.log(error)
   }
})

// Adding doctors
router.post("/register", async function (req, res, next) {
    const {name,
    specialization,
    experience,
    description,
    address,
    phone,
    email,
    city,
    password
     } = req.body
    const doctor = new Doctor({
    specialization,
    experience,
    description,
    address,
    phone,
    email,
    city,
    password })
    await doctor.save()
    res.redirect("/login")
})

// Login doctor
router.post("/loginDoctor", async function (req, res, next) {
    try {
        const { email, password } = req.body
        const doctor = await doctorModel.findOne({
            email: email,
            password: password,
        })
        console.log(doctor)
        console.log(req.body)
        if (doctor) {
            req.session.doctorId = doctor._id
            req.session.doctorName = doctor.firstname
            return res.redirect("/doctor/profile")
        } else {
            return res.redirect("/doctor/login")
        }
    } catch (error) {
        console.error(error)
        return res.status(500).send("Internal Server Error")
    }
})
//get Appointments

router.get("/appointments", async function (req, res, next) {
    if (!req.session.doctorId) {
        res.redirect("/login")
    } else {
       const Appointments= await appointmentModel.find({ doctorId: req.session.doctorId })
        res.render("doctors/appointments", { Appointments })
    }
})

//list all the appoitments of that doctor

router.get("/appointment-List", async function (req, res, next) {
    try {
        const appointments = await appointmentModel.find({
            doctor: req.session.doctorName,
        })
        res.render("doctor/appointment-list", { appointments })
    } catch (error) {
        console.error(error)
    }
})
//list all prescription

router.get("/prescriptionListing", async function (req, res, next) {
    try {
       const prescriptions= await prescriptionModel.find({ }) 
       res.render("doctor/prescription-list", {prescriptions})
    } catch (error) {
        console.error(error)
    }
})

// reviewing prescription

router.post("/reviewingPrescription", async function (req, res, next) {
    try {
        const prescriptionId = req.body.prescriptionId
        const comment = req.body.prescriptionComment
        await prescriptionModel.findByIdAndUpdate(prescriptionId, {
            comment: comment,
        })

        res.status(200).send("<script>alert('Prescription Reviewed');window.location='/doctor/prescriptionListing'</script>")
    } catch (error) {
        console.error(error)
        res.status(500).send("Internal Server Error")
    }
})
// Logout doctor
router.get("/logout", async function (req, res, next) {
    req.session.destroy(function (err) {
        if (err) {
            console.error("Error destroying session:", err)
        }
        res.redirect("/login")
    })
})


module.exports = router
