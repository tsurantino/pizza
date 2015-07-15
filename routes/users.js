var express = require('express'),
    router = express.Router(),
    passport = require('passport'),
    roles = require('../lib/roles'),
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
    failureFlash : true,
  }));

router.route('/edit/:id')
  .get(roles.is('admin'), function(req, res, next) {
    User.findById(req.params.id, function(err, user) {
      if (err) console.log(err);
      res.render('users/edit', {
        user: user,
        role: {
          // TODO: HACK :(
          judge: user.role == 'judge' ? true : false,
          hacker: user.role == 'hacker' ? true : false,
          admin: user.role == 'admin' ? true : false,
        }
      });
    })
  })
  .post(roles.is('admin'), function(req, res) {
    if (req.body.role) {
      req.body.role = req.body.role.toLowerCase();
    }
    User.update({_id: req.params.id}, req.body, function(err) {
      if (err) {
        console.log(err);

        if (err.code === 11000) {
          // TODO: how to get specific field duplicate???
          req.flash('messages', {
            style: 'danger',
            type: 'Error', 
            text: 'The value you inputted conflicts with another user.',
          });
          res.redirect('/users/edit/'+ req.params.id);
        }
      } else {
        req.flash('messages', {
          style: 'success',
          type: 'Success', 
          text: 'Account updated successfully',
        });
        res.redirect('/users/edit/'+ req.params.id);
      }
    })
  });

router.route('/delete/:id')
  .post(roles.is('admin'), function(req, res) {
    User.findByIdAndRemove(req.params.id, function(err) {
      if (err) {
        console.log(err);
        req.flash('messages', {
          style: 'danger',
          type: 'Error', 
          text: 'Something went wrong deleting that account',
        });
        res.redirect('/users/');
      } else {
        req.flash('messages', {
          style: 'success',
          type: 'Success', 
          text: 'Account deleted successfully',
        });
        res.redirect('/users/');
      }
    })
  });

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
        res.render('users/auth/password_change', {
          user: user,
          layout: '/users/auth/auth_layout' 
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