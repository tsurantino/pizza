var express = require('express'),
    router = express.Router();

router.get('/', function(req, res, next) {
  res.render('users/list');
});

router.route('/login')
  .get(function(req, res, next) {
    res.render('users/login', { 
      layout: '/users/auth_layout' 
    });
  });

router.route('/create')
  .post(function(req, res) {

  })

module.exports = router;