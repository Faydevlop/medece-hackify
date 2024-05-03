var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/register', function(req, res, next) {
  res.render('user/register');
});

router.get('/login', function(req, res, next) {
  res.render('user/login');
});

router.get('/', function(req, res, next) {
  res.render('user/patient-dashboard');
});



module.exports = router;
