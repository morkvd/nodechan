var express = require('express'),
    fs = require('fs'),
    multer = require('multer');

var router = express.Router(),
    upload = multer({dest: './public/media/img' });

router.get('/', function (req, res, next) {
    res.locals.req = req;

    function errorCheck(err) {
        if (err) {
            return next(err);
        }  
    }

    req.getConnection(function (err, connection) {
        // catch errors
        errorCheck(err)


        
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
    function errorCheck(err) {
        if (err) {
            return next(err);
        }  
    }

    console.log('post route works')
    console.dir(req.file);
    fs.rename(req.file.path, './public/media/img/' + (req.file.originalname.replace(/\s+/g, '_')), function (err) {
        req.getConnection(function (err, connection) {
            errorCheck(err);

            connection.query('INSERT INTO `student`.`image` (`ID`, `string`) VALUES (NULL, ?);', [req.file.originalname.replace(/\s+/g, '_')], function (err, result) {
                errorCheck(err);
                res.locals.imageId = result.insertId; // store the ID of the image for later use as FK
                res.locals.boardUrl = req.baseUrl.slice(1); // store the name of the current board

                connection.query('INSERT INTO `student`.`thread` (`ID`, `boardID`, `postID`, `title`) VALUES (NULL, (SELECT ID FROM `student`.`board` WHERE url = ?), NULL, ?);', [res.locals.boardUrl, req.body.title], function (err, result) {
                    errorCheck(err);
                    res.locals.threadId = result.insertId;

                    connection.query('INSERT INTO `student`.`post` (`ID`, `threadID`, `name`, `message`, `imgID`) VALUES (NULL, ?, ?, ?, ?)', [ res.locals.threadId, req.body.name, req.body.message, res.locals.imageId ], function (err, result) {
                        errorCheck(err);
                        res.locals.OpId = result.insertId;

                        console.log(result);

                        connection.query('UPDATE `student`.`thread` SET `postID` = ? WHERE `thread`.`id` = ?', [ res.locals.OpId, res.locals.threadId ], function (err, result) {
                           errorCheck(err);
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