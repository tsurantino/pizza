var express = require('express'),
    router = express.Router(),
    ApplicationController = require('../controllers/applications.js');
    Application = require('../models/application.js');

router.get('/', ApplicationController.list);
router.get('/:id', ApplicationController.single);
router.route('/edit/:id')
  .get(ApplicationController.edit)
  .post([
    ApplicationController.checkAndSaveFile,
    ApplicationController.update,
  ]);


module.exports = router;