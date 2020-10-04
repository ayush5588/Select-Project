const bcrypt = require('bcrypt');
const shortid = require('shortid');
const salt = 5;

const newUser = require('../../model/user').newUser;

const responses = require('../middleware/responses');

exports.signup = (req,res) => {
    const userName = req.body.username;
    const email = req.body.email;
    const password = req.body.password;

    // checking for the email
    newUser
    .findOne({email: email})
    .then((user)=>{
        if(user){
            console.log(`${email} already exists`);
            responses.error(req,res,'error','signUp',`${email} already exists`);
        }else{
            // checking for the userName
            newUser
            .findOne({userName: userName})
            .then((username)=>{
                if(username){
                    console.log(`${userName} already exists`);
                    responses.error(req,res,'error','signUp',`${userName} already exists`);
                }else{
                    bcrypt.hash(password,salt)
                    .then((hashedPassword)=>{
                        const user = new newUser({
                            uid: shortid.generate(),
                            email: email,
                            userName: userName,
                            password: hashedPassword
                        });
                        user
                        .save()
                        .then(()=>{
                            console.log(`User registered successfully`);
                            responses.success(req,res,'success','signUp',`${userName} registered successfully`);
                        })
                        .catch((e)=>{
                            console.log(`Error in saving the new user in db: ${e}`);        
                            responses.error(req,res,'error','signUp','Some error occured. Please try again later');
                        });
                    })
                    .catch((e)=>{
                        console.log(`Error in hashing the password: ${e}`);        
                        responses.error(req,res,'error','signUp','Some error occured. Please try again later');
                    });
                    
                }
            })
            .catch((e)=>{
                console.log(`Error in quering the db for username: ${e}`);        
                responses.error(req,res,'error','signUp','Some error occured. Please try again later');
            });
        }
    })
    .catch((e)=>{
        console.log(`Error in quering the db for email: ${e}`);
        responses.error(req,res,'error','signUp','Some error occured. Please try again later');
    });
}