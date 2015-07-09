var express = require('express'),
    router = express.Router(),
    ApplicationController = require('../controllers/applications.js');
    Application = require('../models/application.js');
    User = require('../models/user.js');

router.get('/', function(req, res, next) {
  res.render('index');
});

router.route('/apply')
  .get(function(req, res, next) {
    res.render('applications/create', {
      app: new Application(),
    });
  })
  .post([
    ApplicationController.checkAndSaveFile,
    ApplicationController.create,
  ]);

module.exports = router;
