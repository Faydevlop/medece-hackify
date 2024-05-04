var express = require("express")
var router = express.Router()
var session = require("express-session")
var Doctor = require("../model/doctorModel")

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
    if (!req.session.doctorId) {
        res.redirect("/login")
    } else {
        Doctor.findById(req.session.doctorId, function (err, doctor) {
            if (err || !doctor) {
                res.redirect("/login")
            } else {
                res.render("doctors/profile", {
                    title: "Profile",
                    doctor: doctor,
                })
            }
        })
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
    const { email, password } = req.body
    const doctor = await Doctor.findOne({ email})
    if (doctor) {
        req.session.doctorId = doctor._id
        res.redirect("/profile")
    } else {
        res.redirect("/login")
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
