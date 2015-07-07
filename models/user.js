var bcrypt = require('bcrypt'),
    SALT_WORK_FACTOR = 10,
    mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var userSchema = Schema({
  username: { type: String, required: true, index: { unique: true, } },
  email: { type: String, required: true, index: { unique: true, } },
  password: { type: String},
  role: { type: String, },

  resetpassword: { type: String, },
  changepassword: { type: String, },

  application: { type: Schema.Types.ObjectId, ref: 'Application' },
});

userSchema.pre('save', function(next) {
  var user = this;

  if (!user.isModified('password')) return next();

  bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
    if (err) return next(err);

    bcrypt.hash(user.password, salt, function(err, hash) {
      if (err) return next(err);

      // override the cleartext password with the hashed one
      user.password = hash;
      next();
    });
  });
});

userSchema.methods.comparePassword = function(candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};

module.exports = mongoose.model('User', userSchema);