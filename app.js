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
    boardRouter = require('./routes/board'),
    threadRouter = require('./routes/thread'),
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

// Use the bodyParser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// Setup routing - files
app.use('/', indexRouter);
app.use('/:board', boardRouter);
app.use('/:board/:thread', threadRouter);
app.use(errorRouter);

// Start de server
app.listen(3000, function () {
  console.log('App listening at http://localhost:3000');


  console.log('░░░░░░░░░▄▄▄▄▄');
  console.log('░░░░░░░░▀▀▀██████▄▄▄');
  console.log('░░░░░░▄▄▄▄▄░░█████████▄                          GOTTA');
  console.log('░░░░░▀▀▀▀█████▌░▀▐▄░▀▐█                                  GO');
  console.log('░░░▀▀█████▄▄░▀██████▄██                                     FAST! ');
  console.log('░░░▀▄▄▄▄▄░░▀▀█▄▀█════█▀');
  console.log('░░░░░░░░▀▀▀▄░░▀▀███░▀░░░░░░▄▄');
  console.log('░░░░░▄███▀▀██▄████████▄░▄▀▀▀██▌');
  console.log('░░░██▀▄▄▄██▀▄███▀░▀▀████░░░░░▀█▄');
  console.log('▄▀▀▀▄██▄▀▀▌████▒▒▒▒▒▒███░░░░▌▄▄▀');
  console.log('▌░░░░▐▀████▐███▒▒▒▒▒▐██▌');
  console.log('▀▄░░▄▀░░░▀▀████▒▒▒▒▄██▀');
  console.log('░░▀▀░░░░░░▀▀█████████▀');
  console.log('░░░░░░░░▄▄██▀██████▀█');
  console.log('░░░░░░▄██▀░░░░░▀▀▀░░█');
  console.log('░░░░░▄█░░░░░░░░░░░░░▐▌');
  console.log('░▄▄▄▄█▌░░░░░░░░░░░░░░▀█▄▄▄▄▀▀▄');
  console.log('▌░░░░░▐░░░░░░░░░░░░░░░░▀▀▄▄▄▀﻿');
});