var express = require('express'),
    router = express.Router(),
    passport = require('passport'),
    User = require('../models/user'),
    UserController = require('../controllers/users');

router.get('/', function(req, res, next) {
  User.find({}, function(err, users) {
    res.render('users/list', {
      users: users,
    });
  })
});

router.route('/create')
  .post(passport.authenticate('create', {
    successRedirect: '/users',
    failureRedirect: '/users',
    failureFlash : true  ,
  }));

router.route('/login')
  .get(function(req, res, next) {
    res.render('users/login', { 
      layout: '/users/auth_layout' 
    });
  })
  .post(passport.authenticate('login', {
    successRedirect: '/',
    failureRedirect: '/users/login',
    failureFlash: true
  }));

router.route('/resetpassword')
  .get(function(req, res, next) {
    res.render('users/password_reset', {
      layout: '/users/auth_layout' 
    });
  })
  .post(function(req, res) {
    User.findOne({ email: req.body['email'] }, function(err, user) {
      if (err) console.log(err);
      if (user) {
        UserController.setToResetPassword(req, user, function(err, req, user) {
          req.flash('messages', {
            style: 'success',
            type: 'Success', 
            text: 'A link to confirm your password reset has been sent to your email',
          });
          res.redirect('/users/resetpassword');
        });
      } else {
        req.flash('messages', {
          style: 'danger',
          type: 'Error', 
          text: 'There is no user with that e-mail in our database',
        });
        res.redirect('/users/resetpassword');
      }
    });
  })

router.route('/resetpassword/:hash')
  .get(function(req, res, next) {
    User.findOne({ resetpassword: req.params.hash }, function(err, user) {
      if (err) console.log(err);
      if (user) {
        user.resetpassword = null;
        UserController.setToChangePassword(req, user, function(err, req, user) {
          req.flash('messages', {
            style: 'success',
            type: 'Success', 
            text: 'A link to change your password has been sent to your e-mail',
          });
          res.redirect('/users/login');
        })
      } else {
        res.redirect('/users/login');
      }
    });
  })

router.route('/changepassword/:hash')
  .get(function(req, res, next) {
    User.findOne({ changepassword: req.params.hash }, function(err, user) {
      if (err) console.log(err);
      if (user) {
        res.render('users/password_change', {
          user: user,
          layout: '/users/auth_layout' 
        });
      } else {
        res.redirect('/users/login');
      }
    });
  })
  .post(function(req, res) {
    User.findOne({ changepassword: req.params.hash }, function(err, user) {
      if (err) console.log(err);
      if (user) {
        if (req.body['passwordOriginal'] == req.body['passwordConfirm']) {
          user.password = req.body['passwordOriginal'];
          user.changepassword = null;
          user.save(function(err) {
            if (err) console.log(err);

            req.flash('messages', {
              style: 'success',
              type: 'Success', 
              text: 'You have successfully changed your password',
            });

            res.redirect('/users/login');
          });
        } else {
          console.log('Passwords do not match');
          req.flash('messages', {
            style: 'danger',
            type: 'Error', 
            text: 'Your passwords do not match',
          });
          res.redirect('/users/changepassword/' + req.params.hash);
        }
      } else {
        res.redirect('/users/login');
      }
    });
  });

module.exports = router;