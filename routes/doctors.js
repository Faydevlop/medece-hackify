var express = require("express")
var router = express.Router()
var session = require("express-session")
var Doctor = require("../model/doctors")

router.use(
    session({
        secret: "doctor", 
        resave: false,
        saveUninitialized: true,
    })
)

/* GET login page. */
router.get("/login", function (req, res, next) {
    res.render("doctors/login", { title: "Login" })
})

// get doctor register page
router.get("/register", function (req, res, next) {
    res.render("doctors/register", { title: "Register" })
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
router.post("/addDoctor", async function (req, res, next) {
    const { name, email, password } = req.body
    const doctor = new Doctor({ name, email, password })
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
