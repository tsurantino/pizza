var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var accountSchema = Schema({
  username: { type: String, },
  password: { type: String, },
  email: { type: String, },
  role: { type: String, },
});

module.exports = mongoose.model('Account', accountSchema);