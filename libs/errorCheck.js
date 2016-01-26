module.exports.errorCheck = function (err, next) {
    if (err) {
       next(err);
       //res.render('error',  {title: '???', h1: err});
    }
};
