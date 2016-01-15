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

    req.getConnection(function (err, connection) {
        // catch errors
        errorCheck(err, next);

        // run query
        connection.query('SELECT board.ID AS boardID, board.name AS boardName, board.description AS boardDescription, board.url AS boardUrl, post.ID AS postID, post.name AS postName, post.message AS postMessage, post.timestamp AS timestamp, thread.title AS threadTitle, image.string AS imageString FROM student.thread LEFT JOIN board ON thread.boardID = board.ID LEFT JOIN post ON thread.postID = post.ID LEFT JOIN image ON post.imgID = image.ID WHERE board.url = ?', [req.baseUrl.substr(1)], function (err, result) {
            errorCheck(err, next);

            //console.log(result, req.baseUrl.substr(1));
            res.render('board', {title: 'homepage', h1: 'welcome to cmd-chan', threads: result});
        });
    });
});

router.post('/start', upload.single('img'), function (req, res, next) {
    console.log('post route works');

    console.dir(req.file);

    fs.rename(req.file.path, './public/media/img/' + (req.file.originalname.replace(/\s+/g, '_')), function (err) {
        req.getConnection(function (err, connection) {
            errorCheck(err, next);

            connection.query('INSERT INTO `student`.`image` (`ID`, `string`) VALUES (NULL, ?);', [req.file.originalname.replace(/\s+/g, '_')], function (err, result) {
                errorCheck(err, next);

                res.locals.imageId = result.insertId; // store the ID of the image for later use as FK
                res.locals.boardUrl = req.baseUrl.slice(1); // store the name of the current board

                connection.query('INSERT INTO `student`.`thread` (`ID`, `boardID`, `postID`, `title`) VALUES (NULL, (SELECT ID FROM `student`.`board` WHERE url = ?), NULL, ?);', [res.locals.boardUrl, req.body.title], function (err, result) {
                    errorCheck(err, next);
                    res.locals.threadId = result.insertId;

                    connection.query('INSERT INTO `student`.`post` (`ID`, `threadID`, `name`, `message`, `imgID`, `timestamp`) VALUES (NULL, ?, ?, ?, ?, NULL)', [ res.locals.threadId, req.body.name, req.body.message, res.locals.imageId ], function (err, result) {
                        errorCheck(err, next);
                        res.locals.OpId = result.insertId;

                        console.log(result);

                        connection.query('UPDATE `student`.`thread` SET `postID` = ? WHERE `thread`.`id` = ?', [ res.locals.OpId, res.locals.threadId ], function (err, result) {
                           errorCheck(err, next);
                           console.log(result);

                           res.redirect(req.baseUrl);
                        });
                    });
                });
            });
        });

        console.log("file recieved and renamed");
    });
});

module.exports = router;