module.exports.errorCheck = function (err, next) {
    if (err) {
        return next(err);
    }
};
