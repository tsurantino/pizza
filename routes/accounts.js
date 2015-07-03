var express = require('express'),
    router = express.Router();

router.get('/', function(req, res, next) {
  res.render('accounts/list');
});

router.get('/login', function(req, res, next) {
  res.render('accounts/login', { layout: '/accounts/auth_layout' });
});

module.exports = router;