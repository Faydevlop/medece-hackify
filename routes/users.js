var express = require('express');
var router = express.Router();
const patientModel = require('../model/patientModel');
const session = require("express-session");
//implementing session
router.use(
    session({
        secret: "secret", 
        resave: false,
        saveUninitialized: true,
    })
)
/* GET home page. */
router.get('/register', function(req, res, next) {
  res.render('user/register');
});
// adding patients
router.post("/register", function(req, res, next) {
     try {
       const newPatient = new patientModel(req.body);
       newPatient.save();
       res.redirect("/login");
     } catch (error) {
      console.log(error);
     }
})
//getting login page
router.get('/login', function(req, res, next) {
  res.render('user/login');
});
// login user
router.post("/login", async function (req, res, next) {
    try {
        const email = req.body.email
        const password = req.body.password
        const user = await patientModel.findOne({ email, password })
        if (user) {
            req.session.user = user 
            res.redirect("/patient-dashboard")
        } else {
            res.redirect("/login") 
        }
    } catch (error) {
        console.error(error)
        res.status(500).send("Internal Server Error")
    }
})
//getting patient dashboard after login
router.get("/patient-dashboard", function (req, res, next) {
    const user = req.session.user 
    if (user) {
        res.render("user/patient-dashboard", {user: user })
    } else {
        res.redirect("/login")
    }
})
router.get('/', function(req, res, next) {
  res.redirect("/login")
});

module.exports = router;
