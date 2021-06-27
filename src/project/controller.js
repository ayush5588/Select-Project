// Importing the packages
const shortID = require('shortid');
const mongodb = require('mongodb');

// Importing the models
const newProject = require('../../model/project').newProject;
const onGoingProjects = require('../../model/project').onGoingProjects;
const completedProjects = require('../../model/project').completedProjects;
const responses = require('../middleware/responses');

// Adding a new project
exports.addProject = (req,res)=>{
    const uid = shortID.generate();
    console.log(req.session);
    const userEmail = req.session.user;
    //console.log(userEmail);
    //const userEmail = req.body.email;
    const title = req.body.title;
    const description = req.body.description;

    newProject
    .findOne({userEmail:userEmail,title: title})
    .then((exists)=>{
        if(exists){
            responses.error(req,res,'info','addProject',`${title} already exists in your list`);
        }else{
            const project = new newProject({
                uid: uid,
                userEmail: userEmail,
                title: title,
                description: description,
                status: 0
            });
        
            project
            .save()
            .then((data)=>{
                responses.success(req,res,'info','addProject',`${title} has been added to your list`);
            })
            .catch((e)=>{
                console.log(`Issue in saving the data: ${e}`);
                responses.error(req,res,'info','addProject',`Error in saving ${title} to your list. Please try again later`);
            });
        }
    })
    .catch((e)=>{
        console.log(`Error in checking the db: ${e}`);
        responses.error(req,res,'info','addProject',`Error occured. Please try again later`);
    });

    
}


// Updating the status of the existing project
exports.updateStatus = (req,res)=>{
    // The user can either mark the project as started or as completed AND he/she can also restart a project
    const userEmail = req.session.user;
    console.log(userEmail);
    // test email const userEmail = req.body.email;
    const status = req.body.status;
    const title = req.body.title;

    if(status == 'start'){
        newProject
        .findOne({userEmail:userEmail,title: title})
        .then((response)=>{
            const project_id = response._id;
            // checking whether the project exists in the completed collection
            // if it does then remove it from there
            completedProjects
            .findOne({project: new mongodb.ObjectID(project_id)})
            .then((exists)=>{ 
                if(exists){
                    completedProjects
                    .deleteOne({project: new mongodb.ObjectID(project_id)})
                    .then(()=>{
                        console.log(`The project ${title} has been removed from the completedProjects collection`);
                        // Inserting in the onGoing collection
                        var projectStarted = new onGoingProjects({
                            project: project_id
                        });
                        projectStarted
                        .save()
                        .then(()=>{
                            console.log(`The project ${title} has been inserted into the onGoingProjects collection`);
                            //res.json({code: 1,message: `The status of project ${title} has been updated`});
                            newProject
                            .findOneAndUpdate({userEmail:userEmail,title: title},{$set: {status: 1}})
                            .then((data)=>{
                                console.log('Status has been updated');
                                req.flash('info',`${title} status has been updated`);
                                res.locals.message = req.flash();
                                newProject
                                .find({userEmail: userEmail})
                                .then((data)=>{
                                    res.render('showProjects',{projects: data});
                                })
                                .catch((e)=>{
                                    console.log(`Error in getting the data from db: ${e}`);
                                    responses.error(req,res,'info','showProjects',`Error occured. Please try again later`);
                                });
                            })
                            .catch((e)=>{
                                console.log(`Error: ${e}`);
                                responses.error(req,res,'info','showProjects',`Error occured. Please try again later`);
                            });
                        })
                        .catch((e)=>{
                            console.log(`Error in saving the project in onGoingProjects collection: ${e}`);
                            responses.error(req,res,'info','showProjects',`Error occured. Please try again later`);
                        });
                    })
                    .catch((e)=>{
                        console.log(`Error in deleting the project ${title} from the completedProjects collection:${e}`);
                        responses.error(req,res,'info','showProjects',`Error occured. Please try again later`);
                    });
                }else{
                    // The project doesn't exist in the completedProjects collection
                    // This is the 1st time project is getting started
                    onGoingProjects
                        .findOne({project: new mongodb.ObjectID(project_id)})
                        .then((data)=>{
                            if(data){
                                // project already exists in the db
                                console.log('Status has been updated');
                                req.flash('info',`${title} status has been updated`);
                                res.locals.message = req.flash();
                                newProject
                                .find({userEmail: userEmail})
                                .then((data)=>{
                                    res.render('showProjects',{projects: data});
                                })
                                .catch((e)=>{
                                    console.log(`Error in getting the data from db: ${e}`);
                                    responses.error(req,res,'info','showProjects',`Error in updating the status of ${title}. Please try again later`);
                                });

                            }else{
                                // Inserting in the onGoing collection
                                var projectStarted = new onGoingProjects({
                                    project: project_id
                                });
                                projectStarted
                                .save()
                                .then((data)=>{
                                    console.log(`The project ${title} has been inserted into the onGoingProjects collection`);
                                    //res.json({code: 1,message: `The status of project ${title} has been updated`});
                                    newProject
                                    .findOneAndUpdate({userEmail:userEmail,title: title},{$set: {status: 1}})
                                    .then((data)=>{
                                        console.log('Status has been updated');
                                        req.flash('info',`${title} status has been updated`);
                                        res.locals.message = req.flash();
                                        newProject
                                        .find({userEmail: userEmail})
                                        .then((data)=>{
                                            res.render('showProjects',{projects: data});
                                        })
                                        .catch((e)=>{
                                            console.log(`Error in getting the data from db: ${e}`);
                                            responses.error(req,res,'info','showProjects',`Error occured. Please try again later`);
                                        });
                                    })
                                    .catch((e)=>{
                                        console.log(`Error: ${e}`);
                                        responses.error(req,res,'info','showProjects',`Error occured. Please try again later`);
                                    });
                                })
                                .catch((e)=>{
                                    console.log(`Error in saving the project in onGoingProjects collection: ${e}`);
                                    responses.error(req,res,'info','showProjects',`Error occured. Please try again later`);
                                });
                            }
                        })
                        .catch((e)=>{
                            console.log(`Error: ${e}`);
                            responses.error(req,res,'info','showProjects',`Error occured. Please try again later`);
                        })
                    
                }
            })
            .catch((e)=>{
                console.log(`Error in getting the data from the completedProjects: ${e}`);
                responses.error(req,res,'info','showProjects',`Error occured. Please try again later`);
            });
        })
        .catch((e)=>{
            console.log(`Error in getting the data from project db: ${e}`);
            responses.error(req,res,'info','showProjects',`Error occured. Please try again later`);
        });

    }
    // the status of the project is completed
    else{
        newProject
        .findOne({userEmail:userEmail,title: title})
        .then((response)=>{
            const project_id = response._id;
            // checking whether the project exists in the onGoingProjects collection
            // if it does then remove it from there
            onGoingProjects
            .findOne({project: new mongodb.ObjectID(project_id)})
            .then((exists)=>{ 
                if(exists){
                    onGoingProjects
                    .deleteOne({project: new mongodb.ObjectID(project_id)})
                    .then(()=>{
                        console.log(`The project ${title} has been removed from the onGoingProjects collection`);
                        // Inserting in the completedProjects collection
                        var projectCompleted = new completedProjects({
                            project: project_id
                        });
                        projectCompleted
                        .save()
                        .then(()=>{
                            console.log(`The project ${title} has been inserted into the completedProjects collection`);
                            //res.json({code: 1,message: `The status of project ${title} has been updated`});
                            newProject
                            .findOneAndUpdate({userEmail:userEmail,title: title},{$set: {status: 2}})
                            .then(()=>{
                                console.log('Status has been updated');
                                req.flash('info',`${title} status has been updated`);
                                res.locals.message = req.flash();
                                newProject
                                .find({userEmail: userEmail})
                                .then((data)=>{
                                    res.render('showProjects',{projects: data});
                                })
                                .catch((e)=>{
                                    console.log(`Error in getting the data from db: ${e}`);
                                    responses.error(req,res,'info','showProjects',`Error occured. Please try again later`);
                                });
                            })
                            .catch((e)=>{
                                console.log(`Error: ${e}`);
                                responses.error(req,res,'info','showProjects',`Error occured. Please try again later`);
                            });
                        })
                        .catch((e)=>{
                            console.log(`Error in saving the project in completedProjects collection: ${e}`);
                            responses.error(req,res,'info','showProjects',`Error occured. Please try again later`);
                        });
                    })
                    .catch((e)=>{
                        console.log(`Error in deleting the project ${title} from the onGoingProjects collection`);
                        responses.error(req,res,'info','showProjects',`Error occured. Please try again later`);
                    });
                }else{
                    // The project doesn't exist in the onGoingProjects collection
                    // Inserting in the completedProjects collection
                    var projectCompleted = new completedProjects({
                        project: project_id
                    });
                    projectCompleted
                    .save()
                    .then(()=>{
                        console.log(`The project ${title} has been inserted into the completedProjects collection`);
                        //res.json({code: 1,message: `The status of project ${title} has been updated`});
                        newProject
                        .findOneAndUpdate({userEmail:userEmail,title: title},{$set: {status: 2}})
                        .then((data)=>{
                            console.log('Status has been updated');
                            req.flash('info',`${title} status has been updated`);
                            res.locals.message = req.flash();
                            newProject
                                .find({userEmail: userEmail})
                                .then((data)=>{
                                    res.render('showProjects',{projects: data});
                                })
                                .catch((e)=>{
                                    console.log(`Error in getting the data from db: ${e}`);
                                    responses.error(req,res,'info','showProjects',`Error occured. Please try again later`);
                                });
                        })
                        .catch((e)=>{
                            console.log(`Error: ${e}`);
                            responses.error(req,res,'info','showProjects',`Error occured. Please try again later`);
                        });
                    })
                    .catch((e)=>{
                        console.log(`Error in saving the project in completedProjects collection: ${e}`);
                        responses.error(req,res,'info','showProjects',`Error occured. Please try again later`);
                    });
                }
            })
            .catch((e)=>{
                console.log(`Error in getting the data from the onGoingProjects: ${e}`);
                responses.error(req,res,'info','showProjects',`Error occured. Please try again later`);
            });
        })
        .catch((e)=>{
            console.log(`Error in getting the data from project db: ${e}`);
            responses.error(req,res,'info','showProjects',`Error occured. Please try again later`);
        });
    }
}



exports.getAllProjects = (req,res)=>{
    const userEmail = req.session.user;
    console.log(userEmail);
    //const userEmail = req.body.email;
    newProject
    .find({userEmail:userEmail})
    .then((data)=>{
        res.render('showProjects',{projects: data});
    })
    .catch((e)=>{
        console.log(`Error in getting the data from db: ${e}`);
        responses.error(req,res,'info','showProjects',`Error occured. Please try again later`);
    });
}


exports.suggestProject = (req,res) => {
     const userEmail = req.session.user;
    //const userEmail = req.body.email;
    newProject
    .find({userEmail:userEmail,status: 0})
    .then((data)=>{
        //console.log(data);
        if(data.length>=1){
            let titleArray = [];
            data.forEach((project)=>{
                titleArray.push(project.title);
            });
            const randomProject = titleArray[Math.floor(Math.random() * titleArray.length)];
            responses.error(req,res,'randomProject','userMain',`Let's go with : ${randomProject}`);
            //console.log(titleArray);
        }else{
            console.log('There are no new projects in your list to be started.');
            responses.error(req,res,'noProject','userMain',`There are no new Projects in your list to be started.`);
        }
        
        
    })
    .catch((e)=>{
        console.log(`${e}`);
        responses.error(req,res,'noProject','home',`Error occured. Please try again later`);
    })
}