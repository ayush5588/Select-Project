const mongoose = require('mongoose');
const url = process.env.DB_URL;

mongoose.connect(url,{useUnifiedTopology: true,useNewUrlParser: true,useFindAndModify: false},(e)=>{
    if(e){
        console.log(`Error in connecting to db: ${e}`);
    }else{
        console.log('Connected to db');
    }
});