var express = require('express'),
    router = express.Router(),
    passport = require('passport');

router.get('/', function(req, res, next) {
  res.render('users/list');
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