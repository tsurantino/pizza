var crypto = require('crypto'),
    emailer = require('../config/email'),
    roles = require('../config/roles');  
    User = require('../models/user');

module.exports = {
  list: function(req, res, next) {
    User.find({}, function(err, users) {
      res.render('users/list', {
        users: users,
        roles: roles.roles,
      });
    })
  },

  edit: function(req, res, next) {
    User.findById(req.params.id, function(err, user) {
      if (err) console.log(err);
      res.render('users/edit', {
        user: user,
        roles: roles.roles,
      });
    })
  },

  update: function(req, res) {
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
  },

  delete: function(req, res) {
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
  },

  setToChangePassword: function(req, user, cb) {
    user.changepassword = crypto.randomBytes(20).toString('hex');
    user.save(function(err) {
      if (err) {
        console.log('Error in saving user: ' + err);
        throw err;
      }
      emailer.sendMail({
        from: 'Pizza <no-reply@pizza.github.io>',
        to: user.email, 
        subject: 'Change your password on Pizza',
        text: 'Hey!' +
              '\n\n' +
              'You need to visit Pizza and change your password:'  +
              '\n\n' +
              'http://localhost:3000/users/changepassword/' + 
              user.changepassword +
              '\n\n' +
              'See you soon!',
        }, 
        function(err, info) {
          if(err) return console.log(err);
          console.log('Message sent: ' + info.response);
          cb(null, req, user);
        }
      );
    });
  },

  submitResetPassword: function(req, res) {
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
  },

  setToResetPassword: function(req, user, cb) {
    user.resetpassword = crypto.randomBytes(20).toString('hex');
    user.save(function(err) {
      if (err) {
        console.log('Error in saving user: ' + err);
        throw err;
      }
      emailer.sendMail({
        from: 'Pizza <no-reply@pizza.github.io>',
        to: user.email, 
        subject: 'Reset your password on pizza',
        text: 'Hey!' +
              '\n\n' +
              'You\'ve requested a password reset on Pizza ' +
              'visit the website to confirm this to get a link' +
              'to change your password.' +
              '\n\n' +
              'http://localhost:3000/users/resetpassword/' + 
              user.resetpassword +
              '\n\n' +
              'See you soon!',
        }, 
        function(err, info) {
          if(err) return console.log(err);
          console.log('Message sent: ' + info.response);
          cb(null, req, user);
        }
      );
    });
  },

  confirmResetPassword: function(req, res, next) {
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
  },

  showNewPassword: function(req, res, next) {
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
  },

  submitNewPassword: function(req, res) {
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
  },
}