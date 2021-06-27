const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const flash = require('connect-flash');
const cors = require('cors');
const path = require('path');
const allmiddle = require('allmiddle').includeAllMiddle;
// ---------------------------------------------------
//require('dotenv/config');
//require('./model/connection');
const app = express();
require('./model/connection');
// ---------------------------------------------------
//app.set('trust proxy',true);
const sessionStore = new session.MemoryStore;
app.use(session({
    cookie: {maxAge: 900000,httpOnly: true},
    saveUninitialized: false,
    key: process.env.SESSION_KEY,
    secret: process.env.SESSION_SECRET,
    store: sessionStore,
    resave: false
}));

app.set("views", __dirname + "/views");
allmiddle(app);
/* app.use(express.static('public'));
app.use(express.static(__dirname));
app.use(express.json());
app.use(cookieParser());
app.use(logger('dev'));
app.use(express.urlencoded({extended: true}));
app.use(cors());
 */
app.use(flash());

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
app.use('/',signup);
app.use('/',login);
// ---------------------------------------------------

app.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname + "/public/index.html"));
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
