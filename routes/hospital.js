var express = require('express');
var router = express.Router();
var session = require("express-session");
const hostpitalModel = require('../model/hostpitalModel');


//session implementaion
router.use(
    session({
        secret: "hospital",
        resave: false,
        saveUninitialized: true,
    })
)
/* GET hospital login. */
router.get('/login', (req,res)=>{
  res.render('hospital/login')
})
//get hospital registraction
router.get('/register', (req,res)=>{
 res.render('hospital/register')
})
//adding hospitals
router.post("/register", (req, res) => {
    try {
      const newHospital = new hostpitalModel(userName,address,phone, email, password);
      newHospital.save();
      res.redirect("/hospital/login");
    } catch (error) {
      console.log(error);
    }
  })

//login hospital

router.post("/login", (req, res) => {
   try {
     const email = req.body.email;
     const password = req.body.password;
     const user = Hospital.findOne({ email: email, password: password });
     if (user) {
       req.session.hospitalId = hospital._id;
       res.redirect("/hospital/Dashboard");
     }
   } catch (error) {
     console.log(error);
   }
   
})

//dashboard
router.get("/Dashboard", (req, res) => {
    try {
        const id = req.session.hospitalId
        const hospital = hostpitalModel.findById(id)
        res.render("hospital/hospitalDashboard", { hospital: hospital })
    } catch (error) {
        console.log(error)
    }
})
//logout  
router.get("/logout", (req, res) => {
  try {
      req.session.destroy()
      res.redirect("/hospital/login")
  } catch (error) {
    console.log(error);
  }
  
})
module.exports = router;
