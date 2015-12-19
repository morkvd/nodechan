var express = require('express');
var router = express.Router();

router.get('/', function (req, res, next) {
  req.getConnection(function (err, connection) {
    // catch errors
    if (err) return next(err);
    // run query
    connection.query('SELECT * FROM thread LEFT JOIN board ON thread.boardID = board.ID LEFT JOIN post ON thread.postID = post.ID LEFT JOIN image ON post.imgID = image.ID WHERE board.url = ?;', [req.baseUrl.substr(1)], function (err, result) {
        if (err) return next(err);
        console.log(result, req.baseUrl.substr(1));
        res.render('board', {title: 'homepage', h1: 'welcome to cmd-chan', threads: result});
    });
  });
});

module.exports = router;