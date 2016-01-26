var express = require('express');
var router = express.Router();

// admin pannel
router.get('/', function (req, res, next) {
    if (req.session.login) {
        req.getConnection(function (err, connection) {
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
                res.render('admin/index', {title: 'admin panel', h1: 'welcome to the admin panel', boards: req.boards});
            });
        });    
    } else {
        console.log('not logged in');
        res.render('error', {title: 'access denied', h1: 'ACCESS DENIED'});
    }
});

// Adds a board
router.post('/addBoard', function (req, res, next) {
    if (req.session.login) {
        req.getConnection(function (err, connection) {
            if (err) {
                return next(err);
            }

            connection.query('INSERT INTO `student`.`board` (`ID`, `name`, `description`, `url`) VALUES (NULL, ?, ?, ?);', [req.body.name, req.body.description, req.body.url], function (err, result) {
                if (err) {
                    return res.render('error', {title: 'wrong', h1: 'ERROR: fill in all fields pls'});
                }
                console.log(req.body.url, req.body.name, req.body.description);
                console.log(result);
                res.redirect('../');
            });
        });
    } else {
        console.log('not logged in');
        res.render('error', {title: 'access denied', h1: 'ACCESS DENIED'});   
    }

});

// deletes a board
// #TODO: delete all the threads + posts on the board 
router.get('/delete/:board', function (req, res, next) {
    if (req.session.login) {
        req.getConnection(function (err, connection) {
            if (err) {
                return next(err);
            }
            connection.query('DELETE FROM `student`.`board` WHERE `board`.`url` = ?', [req.params.board], function (err, result) {
                if (err) {
                    return next(err);
                }
                console.log(result);
                console.log('deleted board');
                res.redirect('../');
            });
        });
    } else {
        console.log('not logged in');
        res.render('error', {title: 'access denied', h1: 'ACCESS DENIED'});
    }
});

module.exports = router;