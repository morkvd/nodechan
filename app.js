var express = require('express'),
    session = require('express-session'),
    path = require('path'),
    bodyParser = require('body-parser'),
    mysql = require('mysql'),
    myConnection = require('express-myconnection');

// setup express
var app = express();

// load routers
var indexRouter = require('./routes/index'),
    loginRouter = require('./routes/login')
    boardRouter = require('./routes/board'),
    threadRouter = require('./routes/thread'),
    adminRouter = require('./routes/admin'),
    errorRouter = require('./routes/error');

// Setup de view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
 
// Setup serveren van statische bestanden
app.use(express.static('public'));

// create connection with DB
app.use(myConnection(mysql, {
    host: 'localhost',
    user: 'student',
    password: 'serverSide',
    port: 3306,
    database: 'student'
}, 'single'));

// Use session
app.use(session({
    secret: "HoleInThisPlatinumShipOfFools_NomadicRule_ConceptNoRules_MobileShrineOfThisDestitute_WastelandMute",
    resave: false,
    saveUninitialized: true
}));

// Use the bodyParser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// Setup routing - files
app.use('/', indexRouter);
app.use('/login', loginRouter);
app.use('/admin', adminRouter);
app.use('/:board', boardRouter);
app.use('/:board/:thread', threadRouter);
app.use(errorRouter);

// Start de server print sonic
app.listen(3000, function () {
    console.log('App listening at http://localhost:3000');

    console.log('░░░░░░░░░░░░▄▐░░░░░░');
    console.log('░░░░░░▄▄▄░░▄██▄░░░░░');
    console.log('░░░░░▐▀█▀▌░░░░▀█▄░░░');
    console.log('░░░░░▐█▄█▌░░░░░░▀█▄░');
    console.log('░░░░░░▀▄▀░░░▄▄▄▄▄▀▀░');
    console.log('░░░░▄▄▄██▀▀▀▀░░░░░░░ U HAVE BEEN SPOOKED BY THE');
    console.log('░░░█▀▄▄▄█░▀▀░░░░░░░░  SPOOKY SKILENTON');
    console.log('░░░▌░▄▄▄▐▌▀▀▀░░░░░░░');
    console.log('▄░▐░░░▄▄░█░▀▀░░░░░░░ GOOD BONES AND CALCIUM');
    console.log('▀█▌░░░▄░▀█▀░▀░░░░░░░  WILL COME TO YOU');
    console.log('░░░░░░░▄▄▐▌▄▄░░░░░░░');
    console.log('░░░░░░░▀███▀█░▄░░░░░ BUT ONLY IF YOU INCLUDE');
    console.log('░░░░░░▐▌▀▄▀▄▀▐▄░░░░░  THIS IMAGE IN YOUR NEXT PROJECT');
    console.log('░░░░░░▐▀░░░░░░▐▌░░░░');
    console.log('░░░░░░█░░░░░░░░█░░░░');
    console.log('░░░░░▐▌░░░░░░░░░█░░░');
    console.log('░░░░░█░░░░░░░░░░▐▌░░');
});