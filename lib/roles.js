var connectRoles = require('connect-roles');

var roleHandler = new connectRoles({
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

roleHandler.roles = ['hacker', 'judge', 'admin'];
roleHandler.getRole = function(user) {
  roleHandler.roles.forEach(function(role) {
    if (user.role == role)
      return { role: true, }
  });
}

// This is a catch all ONLY if you ask to check for a role on a route.
// This way, we can ask if the user is authenticated before checking the
// users properties to see if they are the appropriate role.
roleHandler.use(function (req, action) {
  if (!req.isAuthenticated()) {
    req.error = 'login'; // TODO: HACK?
    return false;
  }
})

roleHandler.roles.forEach(function(role) {
  roleHandler.use(role, function(req) {
    if (req.user.role == role)
      return true;
  });
})

roleHandler.use('application owner', function(req) {
  if (req.user.application == req.params.id)
    return true;
});

module.exports = roleHandler;