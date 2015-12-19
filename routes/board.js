var express = require('express');
var router = express.Router();

router.get('/', function (req, res, next) {
  req.getConnection(function (err, connection) {
    // catch errors
    if (err) return next(err);
    // run query
    connection.query('SELECT thread.ID, postID, title, name, message, string AS imageString FROM thread LEFT JOIN post ON thread.postID = post.ID LEFT JOIN image ON post.imgID = image.ID WHERE boardID = ?;', [req.params.threadID], function (err, result) {
      if (err) return next(err);
      console.log(result);
      res.render('index', {title: 'homepage', h1: 'welcome to cmd-chan', threads: result});
    });
  });
});

module.exports = router;