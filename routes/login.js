var express = require('express');
var router = express.Router();

// Show the login form
router.get('/', function(req, res, next) {
    res.locals.req = req;
    res.render('login', {title: 'login', h1: 'login'});
});

router.post('/', function (req, res, next) {
    console.log('a user is trying to login');
    req.getConnection(function (err, connection) {
        if (err) return next(err);
        connection.query('SELECT * FROM users WHERE users.name = ? AND users.password = ?', [req.body.name, req.body.password], function (err, result) {
            if (err) return next(err);

            if (!result.length > 0) return next('user creds are wronk u piece of gosa')
            
            req.session.regenerate(function () {
                req.session.login = (result.length > 0) ? true : false;
                req.session.user = result[0].name;
                res.redirect('..');
            })
        });
    });
});

module.exports = router;