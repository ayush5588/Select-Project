const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const flash = require('connect-flash');
const cors = require('cors');
const path = require('path');

require('dotenv/config');
require('./model/connection');
const app = express();

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
app.use(express.json());
app.use(cookieParser());
app.use(logger('dev'));
app.use(express.urlencoded({extended: true}));
app.use(flash());
app.use(cors());

app.set('view engine','ejs');

const project = require('./src/project/index');
app.use('/project',project);

app.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname+'/public/html/index.html'));
});

const PORT = process.env.PORT || 8000;
app.listen(PORT,(e)=>{
    if(!e){
        console.log(`Server live on http://localhost:${PORT}`);
    }else{
        console.log(e);
    }
})