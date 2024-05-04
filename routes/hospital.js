var express = require('express');
var router = express.Router();
var session = require("express-session");
const hostpitalModel = require('../model/hostpitalModel');
const doctorModel = require('../model/doctorModel');


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
router.post("/register", async (req, res) => {
    try {
        const { username, address, phone, email, password, city } = req.body

     
        const newHospital = new hostpitalModel({
            username: username,
            address: address,
            phone: phone,
            email: email,
            password: password,
            city: city,
        })

     
        await newHospital.save()

   
        res.redirect("/hospital/login")
    } catch (error) {
        console.log(error)
        // Handle errors appropriately
    }
})


//login hospital

router.post("/login", (req, res) => {
   try {
     const email = req.body.email;
     const password = req.body.password;
     const hospital = hostpitalModel.findOne({ email: email, password: password });
     if (hospital) {
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
//get all doctors
router.get("/getDoctors",async (req, res) => {
    try {
         const doctors = await doctorModel.find({hospital:req.session.hospitalId})
        res.render("hospital/doctor-list",{doctors})
    } catch (error) {}
})

// adding doctors
router.get("/add-doctor", (req, res) => {
    try {
        res.render("hospital/add-doctor")
    } catch (error) {
        console.log(error)
    }
})
// adding doctors by hospital

router.post("/add-doctor",async (req, res) => {
        try {
            const {  firstname, lastname,   department,experience, description, address, mobile, email, gender, education, age,city,State, pincode,password}=req.body
            const newDoctor = new doctorModel({
                firstname,
                lastname,
                department,
                experience,
                description,
                address,
                mobile,
                email,
                gender,
                education,
                age,
                city,
                State,
                pincode,
                password,
                hospital:req.session.hospitalId
            })
            newDoctor.save()
            res.redirect("/hospital/getDoctors")
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
