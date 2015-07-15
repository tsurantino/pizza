var multer = require('multer'),
    Application = require('../models/application');

module.exports = {
  list: function(req, res) {
    Application.find({}).exec(function (err, apps) {
      if (err) console.log(err);
      res.render('applications/list', {
        apps: apps,
      });
    })
  },

  // TODO: this is really a judges page
  single: function(req, res, next) {
    Application.findById(req.params.id).populate('owner').exec(function(err, app) {
      if (err) console.log(err);
      res.render('applications/show', {
        app: app,
      });
    })
  },

  new: function(req, res, next) {
    res.render('applications/create', {
      app: new Application(),
    });
  },

  create: function(req, res) {
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
      if (req.files['resumeFile']) {
        req.body.resumeFileName = req.files['resumeFile'].name;
      }
      newApp = new Application(req.body);
      newApp.save(function (err) {
        if (err) {
          errorSave(err, req, res, 'applications/create');
        } else {
          newUser = new User({
            email: req.body.email,
            password: req.body.password,
            role: 'hacker',
            application: newApp._id,
          });
          newUser.save(function(err) {
            if (err) {
              errorSave(err, req, res, 'applications/create');
            } else {
              newApp.owner = newUser._id;
              newApp.save(function(err) {
                if (err) {
                  errorSave(err, req, res, 'applications/create');
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
  },

  edit: function(req, res, next) {
    Application.findById(req.params.id, function(err, app) {
      if (err) console.log(err);
      res.render('applications/edit', {
        app: app,
      });
    })
  },

  update: function(req, res) {
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
      Application.update({ _id:req.params.id }, req.body, function (err) {
        if (err) {
          errorSave(err, req, res, 'applications/edit');
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
  },

  checkAndSaveFile: multer({
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
}

function errorSave(err, req, res, template) {
  console.log(err);
  req.flash('messages', {
    style: 'danger', 
    type: 'Error',
    text: 'Something went wrong saving the application to our database. ' + err,
  });
  res.locals.messages = req.flash('messages');
  res.render(template, {
    app: req.body,
  });
}