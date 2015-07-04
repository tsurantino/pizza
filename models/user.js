var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var userSchema = Schema({
  username: { type: String, },
  password: { type: String, },
  email: { type: String, },
  role: { type: String, },
});

module.exports = mongoose.model('User', userSchema);