var express = require('express'),
    routes = require('./routes'),
    user = require('./routes/user'),
    http = require('http'),
    path = require('path');

var session = require('express-session');
var cookieParser = require("cookie-parser");
var app = express();
var mysql = require('mysql');
var bodyParser = require("body-parser");
const bcrypt = require('bcrypt');
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '12345678',
    database: 'coderszine_demo'
});

connection.connect();

global.db = connection;

app.set('port', process.env.PORT || 9090);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60000 } //60000
}))

app.get('/', routes.index);
app.get('/login', routes.index);

app.get('/signup', user.signup);
app.post('/signup', user.signup);

app.post('/login', user.login);
app.get('/home/dashboard', user.dashboard);
app.get('/home/logout', user.logout);
app.get('/home/profile', user.profile);
app.listen(9090)