var express = require('express'),
    router = express.Router(),
    multer = require('multer'),
    Application = require('../models/application.js');

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
    multer({
      dest: './public/resumes',
      rename: function (fieldname, filename) {
        return filename.replace(/\W+/g, '-').toLowerCase() + Date.now();
      },
      onFileUploadStart: function (file, req, res) {
        if (file.extension != 'pdf') {
          req.body.fileType = 'INVALID'
          return false;
        }
      }
    }),
    function(req, res) {
      if (req.body.fileType == 'INVALID') {
        req.flash('messages', {
          style: 'danger', 
          type: 'Error',
          text: 'You must upload your resume in PDF format.',
        });
        res.locals.messages = req.flash('messages');
        console.log(req.body);
        res.render('applications/create', {
          app: req.body,
        });
      } else {
        console.log(req.body);
        console.log(req.files);
        res.redirect('/apply');
      }
    }
  ]);

module.exports = router;
