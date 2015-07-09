var express = require('express'),
    router = express.Router(),
    ApplicationController = require('../controllers/applications.js');
    Application = require('../models/application.js');

router.get('/', function(req, res, next) {
  Application.find({}).exec(function (err, apps) {
    if (err) console.log(err);
    res.render('applications/list', {
      apps: apps,
    });
  })
});

router.get('/:id', function(req, res, next) {
  Application.findById(req.params.id).populate('owner').exec(function(err, app) {
    if (err) console.log(err);
    res.render('applications/show', {
      app: app,
    });
  })
});

router.route('/edit/:id')
  .get(function(req, res, next) {
    Application.findById(req.params.id, function(err, app) {
      if (err) console.log(err);
      res.render('applications/edit', {
        app: app,
      });
    })
  })
  .post([
    ApplicationController.checkAndSaveFile,
    ApplicationController.update,
  ]);


module.exports = router;