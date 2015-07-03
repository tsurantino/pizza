var express = require('express');
var router = express.Router();

router.get('/apply', function(req, res, next) {
  res.render('applications/create');
});

module.exports = router;
