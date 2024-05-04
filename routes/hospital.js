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

router.post("/login", async (req, res) => {
    try {
        const email = req.body.email
        const password = req.body.password
        const hospital = await hostpitalModel.findOne({
            email: email,
            password: password,
        })
        console.log(hospital)
        if (hospital) {
            console.log(hospital.username)
            req.session.hospitalId = hospital._id
            req.session.hospitalName = hospital.username
            console.log(req.session.hospitalName)
            res.redirect("/hospital/Dashboard")
        }
    } catch (error) {
        console.log(error)
    }
})


//dashboard
router.get("/Dashboard", async(req, res) => {
    try {
        const id = req.session.hospitalId
        console.log(id) 
        const hospital =await hostpitalModel.findById(id)
         const doctors = await doctorModel.find({
             hospital: req.session.hospitalId,
         })
        console.log(hospital)
        res.render("hospital/hospitalDashboard", { hospital, doctors })
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
            console.log(req.session.hospitalName)
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
                hospital: req.session.hospitalName,
            })
            newDoctor.save()
            res.redirect("/hospital/getDoctors")
        } catch (error) {
          console.log(error)  
        }
})
//get all dept under the hospital

router.get("/getDept", (req, res) => {
    try {
       res.render("hospital/department") 
    } catch (error) {
       console.log(error) 
    }

})

router.get("/getAddDept", (req, res) => {
    try {
        res.render("hospital/add-department")
    } catch (error) {
       console.log(error) 
    }
})

//adding dept to hospital model
router.post("/addingDept",async (req, res) => {
    try {
        const {departmentName} = req.body
   const deptUpdate =  await  hostpitalModel.findByIdAndUpdate(req.session.hospitalId, {
            $push: {
                departments: departmentName
            }
        })
        res.redirect("/hospital/dashboard")
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
