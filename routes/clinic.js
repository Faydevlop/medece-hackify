var express = require('express');
var router = express.Router();
var session = require("express-session")


//session implementaion
router.use(
    session({
        secret: "doctor",
        resave: false,
        saveUninitialized: true,
    })
)
/* GET hospital login. */
router.get('/login', (req,res)=>{
  res.render('clinic/login')
})
//get hospital registraction
router.get('/register', (req,res)=>{
 res.render('clinic/register')
})
//adding hospitals
router.post("/register", (req, res) => {
    try {
      const newDoctor = new Hospital(  name,address,phone, email, password);
      newDoctor.save();
      res.redirect("/clinic/login");
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
       req.session.clincId = hospital._id;
       res.redirect("/clinic/dashboard");
     }
   } catch (error) {
    res.redirect("/clinic/dashboard") 
   }
   
})

//dashboard
router.get("/dashboard", (req, res) => {
  try {
    const id = req.session.clincId;
    const hospital = Hospital.findById(id);
    res.render("clinic/dashboard", { hospital: hospital }); 
  }
  catch (error) {
    console.log(error);
  }
})
//logout  
router.get("/logout", (req, res) => {
  try {
      req.session.destroy()
      res.redirect("/clinic/login")
  } catch (error) {
    console.log(error);
  }
  
})
module.exports = router;
