var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var applicationSchema = Schema({
  fullName: { type: String, },
  school: { type: String, },
  levelOfStudy: { type: String, },
  gradYear: { type: String, },

  teamEmail: { type: String, },

  firstHackathon: { type: Boolean, },
  hardwareHack: { type: Boolean, },
  travelReimbursement: { type: Boolean, },

  vegetarian: { type: Boolean, },
  vegan: { type: Boolean, },
  gluten: { type: Boolean, },
  otherDietaryRestrictions: { type: String, },

  shirt: { type: String, },

  resumeFileName: { type: String, },
  personalSite: { type: String, },
  challengepost: { type: String, },
  github: { type: String, },
  linkedin: { type: String, },
  additionalProfInfo: { type: String, },

  whyAttend: { type: String, },
  mostProudWork: { type: String, },

  owner: { type: Schema.Types.ObjectId, ref: 'User' },
});

module.exports = mongoose.model('Application', applicationSchema);