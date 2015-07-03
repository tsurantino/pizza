var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/apply', function(req, res, next) {
  res.render('applications/create');
});

module.exports = router;
