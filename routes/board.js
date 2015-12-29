var express = require('express');
var fs = require('fs');
var multer = require('multer');


var router = express.Router();
var upload = multer({dest: './public/media/img' })

router.get('/', function (req, res, next) {
    res.locals.req = req;

    req.getConnection(function (err, connection) {
    // catch errors
        if (err) {
            return next(err);
        }
        // run query
        connection.query('SELECT * FROM thread LEFT JOIN board ON thread.boardID = board.ID LEFT JOIN post ON thread.postID = post.ID LEFT JOIN image ON post.imgID = image.ID WHERE board.url = ?;', [req.baseUrl.substr(1)], function (err, result) {
            if (err) {
                return next(err);
            }
            //console.log(result, req.baseUrl.substr(1));
            res.render('board', {title: 'homepage', h1: 'welcome to cmd-chan', threads: result});
        });
    });
});

router.post('/start', upload.single('img'), function (req, res, next) {
    console.log('post route works')
    console.dir(req.file);
    console.log(req.file.destination);
    fs.rename(req.file.path, './public/media/img/' + (req.file.originalname.replace(/\s+/g, '_')), function () {
        console.log("file recieved and renamed");
    });
    res.redirect(req.baseUrl);
});

module.exports = router;