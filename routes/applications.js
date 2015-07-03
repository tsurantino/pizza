var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('applications/list');
});

router.get('/1', function(req, res, next) {
  res.render('applications/show');
});

module.exports = router;