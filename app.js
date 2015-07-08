var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var flash = require('connect-flash');
var session = require('express-session');
var passport = require('passport');
var mongoose = require('mongoose');

var staticRoutes = require('./routes/index');
var applicationRoutes = require('./routes/applications');
var userRoutes = require('./routes/users');

mongoose.connect('mongodb://localhost/pizza');

var app = express();

// HBS
var hbsHelpers = require('./config/hbs');
hbsHelpers();

// VIEW ENGINE
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// DEPENDANCY CONFIGS
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// COOKIE AND SESSION SETTINGS
app.use(cookieParser('secret'));
app.use(session({
    cookie: { maxAge: 3000000 },
    saveUninitialized: true,
    resave: 'true',
    secret: 'secret'
}));

// FLASH SETTINGS
app.use(flash());
app.use(function(req, res, next){
  res.locals.messages = req.flash('messages');
  next();
});

// PASSPORT
app.use(passport.initialize());
app.use(passport.session());

// PASSPORT STRATEGY
var initPassport = require('./config/passport');
initPassport(passport);

// APPLICATION ROUTES
app.use('/', staticRoutes);
app.use('/applications', applicationRoutes);
app.use('/users', userRoutes);

// CATCH ALLS
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
