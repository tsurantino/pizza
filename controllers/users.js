var crypto = require('crypto'),
    emailer = require('../config/email'),  
    User = require('../models/user');

module.exports = {
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
  }
}