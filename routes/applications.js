var express = require('express'),
    router = express.Router(),
    multer = require('multer');
    Application = require('../models/application.js');

router.get('/', function(req, res, next) {
  Application.find({}, function (err, apps) {
    if (err) console.log(err);
    res.render('applications/list', {
      apps: apps,
    });
  })
});

router.get('/:id', function(req, res, next) {
  Application.findById(req.params.id, function(err, app) {
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
        res.render('applications/edit', {
          app: req.body,
        });
      } else {
        if (req.files['resumeFile']) {
          req.body.resumeFileName = req.files['resumeFile'].name;
        }

        console.log(req.body);

        Application.update({ _id:req.params.id }, req.body, function (err) {
          if (err) {
            req.flash('messages', {
              style: 'danger', 
              type: 'Error',
              text: 'Something went wrong saving the application to our database. ' + err,
            });
            res.locals.messages = req.flash('messages');
            res.render('applications/create', {
              app: req.body,
            });
          } else {
            req.flash('messages', {
              style: 'success', 
              type: 'Success',
              text: 'Your edits have been applied to the application.',
            });
            res.redirect('/applications/edit/' + req.params.id);
          }
        });
      }
    }
  ]);

function errorSave(err, req, res) {
  console.log(err);
  
}


module.exports = router;