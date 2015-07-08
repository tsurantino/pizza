var express = require('express'),
    router = express.Router(),
    Application = require('../models/application.js');

router.get('/', function(req, res, next) {
  Application.find({}, function (err, apps) {
    if (err) console.log(err);
    res.render('applications/list', {
      apps: apps,
    });
  })
});

router.get('/1', function(req, res, next) {
  res.render('applications/show');
});

module.exports = router;