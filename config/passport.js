var faker = require('faker'),
    User = require('../models/user'),
    UserController = require('../controllers/users');
    LocalStrategy = require('passport-local').Strategy;

module.exports = function(passport) {
  // get/release user from session store
  passport.serializeUser(function(user, done) {
    done(null, user._id);
  });
   
  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });

  passport.use('login', new LocalStrategy({
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true
    }, 
    function(req, email, password, done) {
      User.findOne({'email': email.toLowerCase()},
        function(err, user) {
          if (err) return done(err);
          
          if (!user) {
            console.log('No user found');
            return done(null, false,
              req.flash('messages', {
                style: 'danger', type: 'Error', text: 'User not found!',
              }));
          }

          user.comparePassword(password, function(err, isMatch) {
            if (err) console.log(err);
            if (!isMatch) {
              console.log('Invalid password');
              req.flash('messages', {
                style: 'danger', type: 'Error', text: 'Invalid password!',
              });
              return done(null, false);
            } else {
              req.flash('messages', {
                style: 'success', type: 'Success', text: 'Login successful!',
              })
              return done(null, user);
            }
          })
        })
    })
  );

  passport.use('create', new LocalStrategy({
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true
    }, 
    function(req, email, password, done) {
      findOrCreateUser = function() {
        User.findOne( { 
          $or: [{'email': email.toLowerCase()}, {'username': req.body['username'].toLowerCase()},], 
        }, function(err, user) {
          if (err) {
            console.log('Error in sign-up: ' + err);
            return done(err);
          }
          if (user) {
            console.log('User already exists.');
            return done(null, false,
              req.flash('messages', {
                style: 'danger', type: 'Error', text: 'User already exists!',
              }));
          } else {
            console.log('Creating a new user');

            var newUser = new User();
            newUser.username = req.body['username'];
            newUser.email = email;
            
            if (password == 'hidden')
              password = faker.internet.password();
            
            newUser.password = password;
            newUser.role = req.body['role'].toLowerCase();
            
            newUser.save(function(err) {
              if (err) {
                console.log('Error in saving user: ' + err);
                throw err;
              }

              console.log('User creation successful');

              UserController.setToChangePassword(req, newUser, function(err, req, newUser) {
                req.flash('messages', {
                  style: 'success',
                  type: 'Success', 
                  text: 'Your account was created successfully',
                });

                return done(err, newUser);
              });
            });
          }
        });
      };

      process.nextTick(findOrCreateUser);
    })
  );
  
  // BCRYPT HELPERS

}