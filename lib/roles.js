var connectRoles = require('connect-roles');

// TODO: can we handle the requirement for authentication better?

var roles = new connectRoles({
  failureHandler: function(req, res, action) {
    if (req.error) {
      req.flash('messages', {
        style: 'danger', 
        type: 'Error',
        text: 'You need to login first.',
      });
      res.redirect('/users/login');
    } else {
      var accept = req.headers.accept || '';
      res.status(403);
      res.render('error', {
        message: 'Access Denied',
        error: {'status': 403}
      });
    }
  }
});

// This is a catch all ONLY if you ask to check for a role on a route.
// This way, we can ask if the user is authenticated before checking the
// users properties to see if they are the appropriate role.
roles.use(function (req, action) {
  if (!req.isAuthenticated()) {
    req.error = 'login'; // TODO: HACK?
    return false;
  }
})

roles.use('admin', function(req) {
  if (req.user.role == 'admin')
    return true;
});

roles.use('judge', function(req) {
  if (req.user.role == 'judge')
    return true;
});

roles.use('application owner', function(req) {
  if (req.user.application == req.params.id)
    return true;
});

module.exports = roles;