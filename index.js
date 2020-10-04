const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const flash = require('connect-flash');
const cors = require('cors');
const path = require('path');

// ---------------------------------------------------
require('dotenv/config');
require('./model/connection');
const app = express();
// ---------------------------------------------------

const sessionStore = new session.MemoryStore;
app.use(session({
    cookie: {maxAge: 60000},
    saveUninitialized: false,
    key: process.env.SESSION_KEY,
    secret: process.env.SESSION_SECRET,
    store: sessionStore,
    resave: false
}));

app.use(express.static('public'));
app.use(express.static(__dirname));
app.set("views", __dirname + "/views"); 
app.use(express.json());
app.use(cookieParser());
app.use(logger('dev'));
app.use(express.urlencoded({extended: true}));
app.use(flash());
app.use(cors());

app.set('view engine','ejs');
// ---------------------------------------------------

// for cases when the cookie remains in the user browser even if the user logged out
app.use((req,res,next)=>{  
    if(req.cookies.user_key && !req.session.user){
        res.clearCookie(process.env.SESSION_KEY);
    }
    next();
});


// --------------------------------------------------
const project = require('./src/project/index');
const signup = require('./src/signUp/index');
const login = require('./src/login/index');

app.use('/project',project);
app.use('/user',signup);
app.use('/user',login);
// ---------------------------------------------------

app.get('/',(req,res)=>{
    res.render('home');
});

// ---------------------------------------------------
const PORT = process.env.PORT || 8000;
app.listen(PORT,(e)=>{
    if(!e){
        console.log(`Server live on http://localhost:${PORT}`);
    }else{
        console.log(e);
    }
});
