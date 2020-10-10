const bcrypt = require('bcrypt');
const session = require('express-session');

const userSchema = require('../../model/user').newUser;

const responses = require('../middleware/responses');

exports.login = (req,res) => {
    const email = req.body.email;
    const password = req.body.password;

    userSchema
    .findOne({email: email})
    .then((user)=>{
        
        const hashedPassword = user.password;
        
        bcrypt.compare(password,hashedPassword)
        .then((result)=>{
            if(result == true){
                console.log('Logged In');
                req.session.user = user.email;
                req.session.loggedIn = true;
                res.render('userMain');
            }else{
                console.log(`Incorrect Password`);
                responses.error(req,res,'error','login','Incorrect Password');
            }
        })
        .catch((e)=>{
            console.log(`error in comparing the passwords: ${e}`);
            responses.error(req,res,'error','login','Error occured. Please try again later');
        });

    })
    .catch((e)=>{
        console.log(`error in querying the db for email: ${e}`);
        responses.error(req,res,'error','login','Error occured. Please try again later');
    });

}


exports.logout = (req,res) => {
    req.session.loggedIn = false;
    req.session.destroy(); // destroying the session
    res.clearCookie(process.env.SESSION_KEY);  // clearing the cookie from the client browser
    res.render('home');  // redirecting the user to home page
}
