var bcrypt = require('bcrypt-nodejs');

var User = require('../models/user');
var LocalStrategy = require('passport-local').Strategy;

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
      passReqToCallback: true // pass req to call back lets us use any req param in strat
    }, 
    function(req, email, password, done) {
      User.findOne({'email': email.toLowerCase()},
        function(err, user) {
          if (err) return done(err);
          
          if (!user) {
            console.log('No user found');
            return done(null, false,
              req.flash('errorMessage', 'User not found!'));
          }

          if (!isValidPassword(user, password)) {
            console.log('Invalid password');
            return done(null, false,
              req.flash('errorMessage', 'Invalid password'));
          }

          return done(null, user, req.flash('successMessage', 'Login successful!'));
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
        User.findOne({'email': email.toLowerCase()}, function(err, user) {
          if (err) {
            console.log('Error in sign-up: ' + err);
            return done(err);
          }
          if (user) {
            console.log('User already exists.');
            return done(null, false,
              req.flash('errorMessage', 'User already exists'));
          } else {
            console.log('Creating a new user');
            // if there is no user with that email
            // create the user
            var newUser = new User();
            newUser.username = req.body['username'];
            newUser.email = email;
            newUser.password = createHash(password);
            newUser.role = req.body['role'].toLowerCase();
            
            newUser.save(function(err) {
              if (err) {
                console.log('Error in saving user: ' + err);
                throw err;
              }

              console.log('User registration successful');
              req.flash('successMessage', 'Registration successful. You may now login');
              return done(null, newUser);
            });
          }
        });
      };

      process.nextTick(findOrCreateUser);
    })
  );
  
  // BCRYPT HELPERS
  var isValidPassword = function(user, password) {
    return bcrypt.compareSync(password, user.password);
  }

  var createHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
  }
}