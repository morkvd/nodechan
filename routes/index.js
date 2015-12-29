var express = require('express');
var router = express.Router();

router.get('/', function (req, res, next) {
    req.getConnection(function (err, connection) {
        // catch errors
        if (err) {
            return next(err);
        }

        // run query
        connection.query('SELECT * FROM board;', function (err, result) {
            req.boards = result;
            if (err) {
                return next(err);
            }
            console.log(result);
            res.render('index', {title: 'homepage', h1: 'welcome to cmd-chan', boards: req.boards });
        });
    });
});

module.exports = router;