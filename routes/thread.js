var express = require('express'),
    fs = require('fs'),
    multer = require('multer');

var router = express.Router(),
    upload = multer({dest: './public/media/img' });


function errorCheck(err, next) {
    if (err) {
        return next(err);
    }  
}


router.get('/', function (req, res, next) {

    var urlParts = req.baseUrl.split('/');

    console.log(req.baseUrl, urlParts);

    req.getConnection(function (err, connection) {
        errorCheck(err, next);

        connection.query('SELECT * FROM thread LEFT JOIN board ON thread.boardID = board.ID LEFT JOIN post ON thread.postID = post.ID LEFT JOIN image ON post.imgID = image.ID WHERE board.url = ? AND thread.ID = ?;', [ urlParts[1], urlParts[2] ], function (err, result) {
            errorCheck(err, next)
            
            res.locals.OP = result[0];

            console.log("#RES.LOCALS.OP: ", res.locals.OP);

            connection.query('SELECT post.ID, post.name, post.message, image.string FROM post LEFT JOIN image ON post.imgID = image.ID WHERE threadID = ? AND NOT post.ID = ?;', [ urlParts[2], res.locals.OP.ID ], function (err, result) {

                res.locals.posts = result;

                console.log("#RES.LOCALS.POSTS: ", res.locals.posts);

                res.render('thread');
            });
        });
    });
});

router.post('/', function (req, res, next) {
    res.redirect(req.baseUrl);
});

module.exports = router;