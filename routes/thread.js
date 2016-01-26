var express = require('express'),
    fs = require('fs'),
    multer = require('multer'),
    utils = require('../libs/errorCheck');

var router = express.Router(),
    upload = multer({dest: './public/media/img'});

router.get('/', function (req, res, next) {
    res.locals.baseUrl = req.baseUrl;

    // save parts of url for use in view
    res.locals.currentBoard = req.baseUrl.split('/')[1];
    res.locals.currentOP = req.baseUrl.split('/')[2];

    req.getConnection(function (err, connection) {
        utils.errorCheck(err, next);

        connection.query('SELECT post.ID AS postID, post.name AS postName, post.message AS postMessage, post.timestamp AS timestamp, image.string AS imageString, thread.title AS threadTitle, thread.ID AS threadID FROM student.post LEFT JOIN student.image ON post.imgID = image.ID LEFT JOIN student.thread ON post.threadID = thread.ID WHERE post.ID = ?;', [res.locals.currentOP], function (err, result) {
            utils.errorCheck(err, next);
            if (result.length === 0) {
                res.render('error',  {title: '404 doesnt exist', h1: 'the thread doesn\'t exist ya dingus'});
            } else {
                res.locals.OP = result[0];

                connection.query('SELECT post.ID AS postID, post.name AS postName, post.message AS postMessage, post.timestamp AS timestamp, thread.iD AS threadID, image.string AS imageString FROM student.post LEFT JOIN student.thread ON post.threadID = thread.ID LEFT JOIN image ON post.imgID = image.ID WHERE threadID = ? AND NOT post.ID = ?;', [res.locals.currentOP, res.locals.OP.threadID], function (err, result) {
                    utils.errorCheck(err, next);
                    res.locals.posts = result;
                    res.render('thread');
                });
            }
        });
    });
});

router.post('/post', upload.single('img'), function (req, res, next) {
    res.locals.currentBoard = req.baseUrl.split('/')[1];
    res.locals.currentOP = req.baseUrl.split('/')[2];

    req.getConnection(function (err, connection) {
        utils.errorCheck(err, next);
        if (!(req.body.name && req.body.message)) {
            res.render('error',  {title: 'doesn\'t work', h1: 'you have to fill in all fields'});
        } else if (req.file) {
            console.log("post with file");
            fs.rename(req.file.path, './public/media/img/' + (req.file.originalname.replace(/\s+/g, '_')), function (err) {
                utils.errorCheck(err, next);

                connection.query('INSERT INTO `student`.`image` (`ID`, `string`) VALUES (NULL, ?);', [req.file.originalname.replace(/\s+/g, '_')], function (err, result) {
                    utils.errorCheck(err, next);
                    res.locals.imageId = result.insertId; // store the ID of the image for later use as FK
                   
                    connection.query('INSERT INTO `student`.`post` (`ID`, `threadID`, `name`, `message`, `imgID`, `timestamp`) VALUES (NULL, ?, ?, ?, ?, NULL)', [res.locals.currentOP, req.body.name, req.body.message, res.locals.imageId], function (err, result) {
                        utils.errorCheck(err, next);
                        res.redirect(req.baseUrl);
                    });  
                });
            });
        } else {
            connection.query('INSERT INTO `student`.`post` (`ID`, `threadID`, `name`, `message`, `imgID`, `timestamp`) VALUES (NULL, ?, ?, ?, NULL, NULL)', [res.locals.currentOP, req.body.name, req.body.message], function (err, result) {
                utils.errorCheck(err, next);
                res.redirect(req.baseUrl);
            });
        }
    });
});

module.exports = router;