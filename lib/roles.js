var connectRoles = require('connect-roles');

var roles = new connectRoles({
  failureHandler: function (req, res, action) {
    var accept = req.headers.accept || '';
    res.status(403);
    res.render('error', {
      message: 'Access Denied',
      error: {'status': 403}
    });
  }
});

roles.use(function (req, action) {
  if (!req.isAuthenticated()) return action === 'public';
})

roles.use('admin', function(req) {
  if (req.user.role == 'admin')
    return true;
});

roles.use('judge', function(req) {
  if (req.user.role == 'admin')
    return true;
});

module.exports = roles;