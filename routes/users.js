var express = require('express'),
    router = express.Router(),
    roles = require('../lib/roles'),
    passport = require('passport'),
    User = require('../models/user'),
    UserController = require('../controllers/users');

router.get('/', UserController.list);

router.route('/edit/:id')
  .get(UserController.edit)
  .post(UserController.update);

router.route('/delete/:id')
  .post(roles.is('admin'), UserController.delete);

router.route('/create')
  .post(passport.authenticate('create', {
    successRedirect: '/users',
    failureRedirect: '/users',
    failureFlash : true,
  }));

router.route('/login')
  .get(function(req, res, next) {
    res.render('users/auth/login', { 
      layout: '/users/auth/auth_layout' 
    });
  })
  .post(passport.authenticate('login', {
    successRedirect: '/',
    failureRedirect: '/users/login',
    failureFlash: true
  }));

router.get('/logout', function (req, res){
  req.logout();
  req.flash('messages', {
    style: 'success',
    type: 'Success', 
    text: 'You\'ve successfully logged out.',
  });
  res.redirect('/');
});

router.route('/resetpassword')
  .get(function(req, res, next) {
    res.render('users/auth/password_reset', {
      layout: '/users/auth/auth_layout' 
    });
  })
  .post(UserController.submitResetPassword);

router.route('/resetpassword/:hash')
  .get(UserController.confirmResetPassword);

router.route('/changepassword/:hash')
  .get(UserController.showNewPassword)
  .post(UserController.submitNewPassword);

module.exports = router;