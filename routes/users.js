var express = require('express'),
    router = express.Router(),
    passport = require('passport'),
    User = require('../models/user');

router.get('/', function(req, res, next) {
  User.find({}, function(err, users) {
    res.render('users/list', {
      users: users,
    });
  })
});

router.route('/login')
  .get(function(req, res, next) {
    console.log(res.locals);
    res.render('users/login', { 
      layout: '/users/auth_layout' 
    });
  })
  .post(passport.authenticate('login', {
    successRedirect: '/',
    failureRedirect: '/users/login',
    failureFlash: true
  }));

router.route('/create')
  .post(passport.authenticate('create', {
    successRedirect: '/users',
    failureRedirect: '/users',
    failureFlash : true  ,
  }));

module.exports = router;