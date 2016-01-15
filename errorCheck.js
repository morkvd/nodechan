function errorCheck(err, next) {
    if (err) {
        return next(err);
    }  
}
