const router = require('express').Router();

router.use('/', require('./feedback'));
router.use('/', require('./solutions'));
router.use('/', require('./authentication'));
router.use('/', require('./group'));
router.use('/', require('./push_notifications'));

module.exports = router;
