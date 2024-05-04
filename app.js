var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require("mongoose")

var docterRouter = require('./routes/doctors');
var usersRouter = require('./routes/users');
var hospitalRouter = require('./routes/hospital')
var prescriptionRouter = require('./routes/prescription')

var app = express();
const port = 4000
//mongo db connection
mongoose.connect("mongodb://localhost:27017/medece").then(()=>{
  console.log("connected to db")
}).catch((err)=>{
  console.log("could not connect to db",err)
})


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/doctor', docterRouter);
app.use('/', usersRouter);
app.use("/hospital", hospitalRouter)
app.use('/prescription',prescriptionRouter)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.listen(port,()=>{
  console.log(`Server listening on http://localhost:${port}`);
})

module.exports = app;
