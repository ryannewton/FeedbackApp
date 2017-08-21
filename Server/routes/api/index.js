const router = require('express').Router();

router.use('/', require('./feedback'));
router.use('/', require('./solutions'));

module.exports = router;
