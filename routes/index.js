var express = require('express'),
    router = express.Router(),
    ApplicationController = require('../controllers/applications.js'),
    Application = require('../models/application.js'),
    User = require('../models/user.js');

router.get('/', function(req, res, next) {
  res.render('index');
});

router.route('/apply')
  .get(ApplicationController.new)
  .post([
    ApplicationController.checkAndSaveFile,
    ApplicationController.create,
  ]);

module.exports = router;
