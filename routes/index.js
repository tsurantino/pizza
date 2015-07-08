var express = require('express'),
    router = express.Router(),
    multer = require('multer'),
    Application = require('../models/application.js'),
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
        res.render('applications/create', {
          app: req.body,
        });
      } else {
        // TODO: this seems messy
        newApp = new Application(req.body);
        newApp.resumeFileName = req.files['resumeFile'].name;
        newApp.save(function (err) {
          if (err) {
            errorSave(err, req, res);
          } else {
            newUser = new User({
              email: req.body.email,
              password: req.body.password,
              role: 'hacker',
              application: newApp._id,
            });
            newUser.save(function(err) {
              if (err) {
                errorSave(err, req, res);
              } else {
                newApp.owner = newUser._id;
                newApp.save(function(err) {
                  if (err) {
                    errorSave(err, req, res);
                  } else {
                    req.flash('messages', {
                      style: 'success', 
                      type: 'Success',
                      text: 'Your application has been submitted. Best of luck!',
                    });
                    res.redirect('/');
                  }
                });
              }
            });
          }
        });
      }
    }
  ]);

function errorSave(err, req, res) {
  console.log(err);
  req.flash('messages', {
    style: 'danger', 
    type: 'Error',
    text: 'Something went wrong saving the application to our database. ' + err,
  });
  res.locals.messages = req.flash('messages');
  res.render('applications/create', {
    app: req.body,
  });
}

module.exports = router;
