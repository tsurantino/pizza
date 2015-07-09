var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    moment = require('moment');

var applicationSchema = Schema({
  dateSubmitted: { type: Date, default: Date.now },
  fullName: { type: String, },
  school: { type: String, },
  levelOfStudy: { type: String, },
  gradYear: { type: String, },
  major: { type: String, },

  teamEmail: { type: String, },

  firstHackathon: { type: Boolean, },
  hardwareHack: { type: Boolean, },
  travelReimbursement: { type: Boolean, },

  dietaryRestrictions: { type: String, },
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

applicationSchema.virtual('formattedDateSubmitted').get(function() {
  return moment(this.dateSubmitted).format('MM/DD/YYYY');
})

module.exports = mongoose.model('Application', applicationSchema);