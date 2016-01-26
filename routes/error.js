var express = require('express');
var router = express.Router();

router.get('*', function (req, res) {
    res.render('error', {title: '404 page not found', h1: 'the page you tried to reach couldn\'t be found'});
});

module.exports = router;