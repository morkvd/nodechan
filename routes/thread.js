var express = require('express');
var router = express.Router();

router.get('/', function (req, res, next) {
    res.render('thread', {threadname: '/node/ general'});
});
router.post('/', function (req, res, next) {
    res.render('thread', {threadname: '/node/ general'});
});

module.exports = router;