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
    res.locals.req = req;

    var urlParts = req.baseUrl.split('/');

    console.log(req.baseUrl, urlParts);

    req.getConnection(function (err, connection) {
        errorCheck(err, next);

        connection.query('SELECT post.ID AS postID, post.name AS postName, post.message AS postMessage, image.string AS imageString, thread.title AS threadTitle, thread.ID AS threadID FROM student.post LEFT JOIN student.image ON post.imgID = image.ID LEFT JOIN student.thread ON post.threadID = thread.ID WHERE post.ID = ?;', [ urlParts[2] ], function (err, result) {
            errorCheck(err, next)
            console.log(result);

            res.locals.OP = result[0];

            console.log("#RES.LOCALS.OP: ", res.locals.OP);

            connection.query('SELECT post.ID AS postID, post.name AS postName, post.message AS postMessage, thread.iD AS threadID, image.string AS imageString FROM student.post LEFT JOIN student.thread ON post.threadID = thread.ID LEFT JOIN image ON post.imgID = image.ID WHERE threadID = ? AND NOT post.ID = ?;', [ res.locals.OP.threadID, urlParts[2] ], function (err, result) {

                res.locals.posts = result;

                console.log("#RES.LOCALS.POSTS: ", res.locals.posts);

                res.render('thread');
            });
        });
    });
});

router.post('/post', upload.single('img'), function (req, res, next) {
    var urlParts = req.baseUrl.split('/');
    req.getConnection(function (err, connection) {
        errorCheck(err, next);
        if (req.file) {
            console.log("post with file");
            fs.rename(req.file.path, './public/media/img/' + (req.file.originalname.replace(/\s+/g, '_')), function (err) {
                errorCheck(err, next);

                connection.query('INSERT INTO `student`.`image` (`ID`, `string`) VALUES (NULL, ?);', [req.file.originalname.replace(/\s+/g, '_')], function (err, result) {
                    errorCheck(err, next);
                    
                    res.locals.imageId = result.insertId; // store the ID of the image for later use as FK

                    connection.query('INSERT INTO `student`.`post` (`ID`, `threadID`, `name`, `message`, `imgID`) VALUES (NULL, ?, ?, ?, ?)', [ urlParts[2], req.body.name, req.body.message, res.locals.imageId ], function (err, result) {
                        errorCheck(err, next);
                        res.redirect(req.baseUrl);
                    });
                });
            });
        } else {
            connection.query('INSERT INTO `student`.`post` (`ID`, `threadID`, `name`, `message`, `imgID`) VALUES (NULL, ?, ?, ?, NULL)', [ urlParts[2], req.body.name, req.body.message ], function (err, result) {
                errorCheck(err, next);
                res.redirect(req.baseUrl);
            });
        }
    });
});

module.exports = router;