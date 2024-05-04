var express = require('express');
var router = express.Router();
const patientModel = require('../model/patientModel');
const session = require("express-session");
const authMiddleware = require('../routes/authMiddleware')
const prescriptionModel = require('../model/prescriptionModel');
const doctorModel = require("../model/doctorModel")
const appointmentModel= require("../model/appointmentModel")
const hospitalModel = require("../model/hostpitalModel")
const requestIp = require('request-ip');
const geoip = require('geoip-lite');
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
router.post("/register", async function (req, res, next) {
    try {
        const { name, email, password, age, gender, city, phone } = req.body
     
        const newPatient = new patientModel({
            name,
            email,
            password,
            age,
            gender,
            city,
            phone,
        })
       
        await newPatient.save()
      
        res.redirect("/login")
    } catch (error) {
     
        console.log(error)
      
        res.status(500).send("Internal Server Error")
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
router.get("/patient-dashboard",authMiddleware,  function (req, res, next) {
    const user = req.session.user 
    if (user) {
        res.render("user/patient-dashboard", {user: user })
    } else {
        res.redirect("/login")
    }
})
router.get('/', authMiddleware,function(req, res, next) {
  res.redirect("/login")
});


router.get('/prescriptionassist', async function(req, res, next) {
  try {
      console.log(req.session.user._id)
      const prescriptions= await prescriptionModel.find({userId:req.session.user._id})
      console.log(prescriptions)
      res.render("user/prescriptionassist", { prescriptions })
  } catch (error) {
    console.log(error)
  }

});


router.get('/enterdetials', authMiddleware,async function(req, res, next) {
  const doctors = await doctorModel.find({})
  const hospitals = await hospitalModel.find({})
  res.render('user/consult',{doctors, hospitals});
});
//finding doctor by filtering
router.post("/finddocter", authMiddleware, async function (req, res, next) {
    try {
        const { symptoms, hospital, specialty } = req.body
        let doctors

        if (hospital && specialty) {
            doctors = await doctorModel.find({
                department: specialty,
                hospital: hospital,
            })
        } else if (hospital) {
            doctors = await doctorModel.find({ hospital: hospital })
        } else if (specialty) {
            doctors = await doctorModel.find({ department: specialty })
        }

        res.render("user/finddocter", { doctors })
    } catch (error) {
        console.log(error)
    }
})


router.get('/vediocall', function(req, res, next) {
  res.render('user/videocall');
});


const { GoogleGenerativeAI } = require('@google/generative-ai');

// Replace with your API key
const genAI = new GoogleGenerativeAI('AIzaSyBQGuYJeShMjlg_QiDHHDeukkLl4zjyado');

router.get('/chat',(req,res)=>{
    res.render('user/chat')
})

router.post('/generate-story', async (req, res) => {
  try {
    const prompt = req.body.prompt; // Extract user input from request body

    const generationConfig = {
      stopSequences: ['red'],
      maxOutputTokens: 200,
      temperature: 0.9,
      topP: 0.1,
      topK: 16,
    };

    const model = genAI.getGenerativeModel({ model: 'gemini-pro', generationConfig });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const storyText = response.text();

    return res.json({ story: storyText });
    // Send generated story as JSON
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Story generation failed' });
  }
});


router.get('/appointment',async(rea,res)=>{
  const doctors =  await doctorModel.find({})
  const hospitals = await hospitalModel.find({})
  res.render('user/appointment',{doctors, hospitals})
})
//booking an appointment

router.post("/book-appointment",async(req,res)=>{
   try {
    const { firstname, lastname, gender, mobile, email, address, date, From, To, doctor, Hospital, Symptom, mode } = req.body
    await new appointmentModel({
        firstname,
        lastname,
        gender,
        mobile,
        email,
        address,
        date,
        From,
        To,
        doctor,
        Hospital,
        Symptom,
        mode,
    }).save()
    res.send('<script>alert("Appointment booked successfully")</script>')
   } catch (error) {
    
   }
})

router.get('/pharma',(req,res)=>{
  res.render('user/pharma/pharma')
})

router.get('/finddocters',(req,res)=>{
  res.render('user/finddocter')
})

router.get('/genaral',(req,res)=>{
  res.render('user/genaral')
})


module.exports = router;
