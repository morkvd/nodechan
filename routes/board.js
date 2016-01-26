var express = require('express'),
    fs = require('fs'),
    multer = require('multer'),
    utils = require('../libs/errorCheck');

var router = express.Router(),
    upload = multer({dest: './public/media/img'});


router.get('/', function (req, res, next) {
    res.locals.baseUrl = req.baseUrl;
    res.locals.urlParts = req.baseUrl.split('/');
    res.locals.currentBoard = res.locals.urlParts[1];

    req.getConnection(function (err, connection) {
        // catch errors
        utils.errorCheck(err, next);

        connection.query('SELECT * FROM board WHERE url = ?', [res.locals.currentBoard], function (err, result) {
            utils.errorCheck(err, next);
            if (!result.length == 0) {
                connection.query('SELECT board.ID AS boardID, board.name AS boardName, board.description AS boardDescription, board.url AS boardUrl, post.ID AS postID, post.name AS postName, post.message AS postMessage, post.timestamp AS timestamp, thread.title AS threadTitle, image.string AS imageString FROM student.thread LEFT JOIN board ON thread.boardID = board.ID LEFT JOIN post ON thread.postID = post.ID LEFT JOIN image ON post.imgID = image.ID WHERE board.url = ?', [res.locals.currentBoard], function (err, result) {
                    
                    utils.errorCheck(err, next);
                    res.render('board', {title: 'homepage', h1: result[0].boardName + ": " + result[0].boardDescription, threads: result});
                });
            } else {
                res.render('error',  {title: '404 doesnt exist', h1: 'the board doesn\'t exist ya dingus'});
            }
        }); 
    });
});

router.post('/start', upload.single('img'), function (req, res, next) {
    res.locals.baseUrl = req.baseUrl;
    res.locals.urlParts = req.baseUrl.split('/');
    res.locals.currentBoard = res.locals.urlParts[1];

    if (req.body.message && req.body.title) {
        fs.rename(req.file.path, './public/media/img/' + (req.file.originalname.replace(/\s+/g, '_')), function (err) {
            req.getConnection(function (err, connection) {
                utils.errorCheck(err, next);

                connection.query('INSERT INTO `student`.`image` (`ID`, `string`) VALUES (NULL, ?);', [req.file.originalname.replace(/\s+/g, '_')], function (err, result) {
                    utils.errorCheck(err, next);

                    res.locals.imageId = result.insertId; // store the ID of the image for later use as FK

                    connection.query('INSERT INTO `student`.`thread` (`ID`, `boardID`, `postID`, `title`) VALUES (NULL, (SELECT ID FROM `student`.`board` WHERE url = ?), NULL, ?);', [res.locals.currentBoard, req.body.title], function (err, result) {
                        utils.errorCheck(err, next);
                        res.locals.threadId = result.insertId;
                        console.log(res.locals.threadId, result);

                        connection.query('INSERT INTO `student`.`post` (`ID`, `threadID`, `name`, `message`, `imgID`, `timestamp`) VALUES (NULL, ?, ?, ?, ?, NULL)', [res.locals.threadId, req.body.name, req.body.message, res.locals.imageId], function (err, result) {
                            utils.errorCheck(err, next);
                            res.locals.OpId = result.insertId;

                            connection.query('UPDATE `student`.`thread` SET `postID` = ? WHERE `thread`.`id` = ?', [res.locals.OpId, res.locals.threadId], function (err, result) {
                                utils.errorCheck(err, next);

                                res.redirect(req.baseUrl);
                            });
                        });
                    });
                });
            });
        });
    } else {
        res.render('error', {title: '404 page not found', h1: 'fill in all the fields ya dingus'})
    }
});

module.exports = router;