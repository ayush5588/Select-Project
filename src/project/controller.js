// Importing the packages
const shortID = require('shortid');
const mongodb = require('mongodb');

// Importing the models
const newProject = require('../../model/project').newProject;
const onGoingProjects = require('../../model/project').onGoingProjects;
const completedProjects = require('../../model/project').completedProjects;

// Adding a new project
exports.addProject = (req,res)=>{
    const uid = shortID.generate();
    //const userEmail = req.session.email;
    const userEmail = req.body.email;
    const title = req.body.title;
    const description = req.body.description;

    newProject
    .findOne({title: title})
    .then((exists)=>{
        if(exists){
            req.flash('info',`${title} already exists in your list`);
            res.locals.message = req.flash();
            res.render('addProject');
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
                //res.json({response: `Project ${title} has been added to your list`});
                req.flash('info',`${title} has been added to your list`);
                res.locals.message = req.flash();
                res.render('addProject');
                //console.log(data);
            })
            .catch((e)=>{
                console.log(`Issue in saving the data: ${e}`);
            });
        }
    })
    .catch((e)=>{
        console.log(`Error in checking the db: ${e}`);
        req.flash('info','Error occured. Please try again later');
        res.locals.message = req.flash();
        res.render('addProject');
    });

    
}


// Updating the status of the existing project
exports.updateStatus = (req,res)=>{
    // The user can either mark the project as started or as completed
    //const userEmail = req.session.email;
    const status = req.body.status;
    const title = req.body.title;

    if(status == 'start'){
        newProject
        .findOne({title: title})
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
                            .findOneAndUpdate({title: title},{$set: {status: 1}})
                            .then((data)=>{
                                console.log('Status has been updated');
                                req.flash('info',`${title} status has been updated`);
                                res.locals.message = req.flash();
                                newProject
                                .find({})
                                .then((data)=>{
                                    res.render('showProjects',{projects: data});
                                })
                                .catch((e)=>{
                                    console.log(`Error in getting the data from db: ${e}`);
                                });
                            })
                            .catch((e)=>{
                                console.log(`Error: ${e}`);
                            });
                        })
                        .catch((e)=>{
                            console.log(`Error in saving the project in onGoingProjects collection: ${e}`);
                        });
                    })
                    .catch((e)=>{
                        console.log(`Error in deleting the project ${title} from the completedProjects collection`);
                    });
                }else{
                    // The project doesn't exist in the completedProjects collection
                    onGoingProjects
                        .find({project: new mongodb.ObjectID(project_id)})
                        .then((data)=>{
                            if(data){
                                // project already exists in the db
                                console.log('Status has been updated');
                                req.flash('info',`${title} status has been updated`);
                                res.locals.message = req.flash();
                                newProject
                                .find({})
                                .then((data)=>{
                                    res.render('showProjects',{projects: data});
                                })
                                .catch((e)=>{
                                    console.log(`Error in getting the data from db: ${e}`);
                                });

                            }else{
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
                                    .findOneAndUpdate({title: title},{$set: {status: 1}})
                                    .then((data)=>{
                                        console.log('Status has been updated');
                                        req.flash('info',`${title} status has been updated`);
                                        res.locals.message = req.flash();
                                        newProject
                                        .find({})
                                        .then((data)=>{
                                            res.render('showProjects',{projects: data});
                                        })
                                        .catch((e)=>{
                                            console.log(`Error in getting the data from db: ${e}`);
                                        });
                                    })
                                    .catch((e)=>{
                                        console.log(`Error: ${e}`);
                                    });
                                })
                                .catch((e)=>{
                                    console.log(`Error in saving the project in onGoingProjects collection: ${e}`);
                                });
                            }
                        })
                        .catch((e)=>{
                            console.log(`Error: ${e}`);
                        })
                    
                }
            })
            .catch((e)=>{
                console.log(`Error in getting the data from the completedProjects: ${e}`);
            });
        })
        .catch((e)=>{
            console.log(`Error in getting the data from project db: ${e}`);
        });

    }
    // the status of the project is completed
    else{
        newProject
        .findOne({title: title})
        .then((response)=>{
            const project_id = response._id;
            // checking whether the project exists in the onGoingProjects collection
            // if it does then remove it from there
            onGoingProjects
            .find({project: new mongodb.ObjectID(project_id)})
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
                            .findOneAndUpdate({title: title},{$set: {status: 2}})
                            .then(()=>{
                                console.log('Status has been updated');
                                req.flash('info',`${title} status has been updated`);
                                res.locals.message = req.flash();
                                newProject
                                .find({})
                                .then((data)=>{
                                    res.render('showProjects',{projects: data});
                                })
                                .catch((e)=>{
                                    console.log(`Error in getting the data from db: ${e}`);
                                });
                            })
                            .catch((e)=>{
                                console.log(`Error: ${e}`);
                            });
                        })
                        .catch((e)=>{
                            console.log(`Error in saving the project in completedProjects collection: ${e}`);
                        });
                    })
                    .catch((e)=>{
                        console.log(`Error in deleting the project ${title} from the onGoingProjects collection`);
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
                        .findOneAndUpdate({title: title},{$set: {status: 2}})
                        .then((data)=>{
                            console.log('Status has been updated');
                            req.flash('info',`${title} status has been updated`);
                            res.locals.message = req.flash();
                            newProject
                                .find({})
                                .then((data)=>{
                                    res.render('showProjects',{projects: data});
                                })
                                .catch((e)=>{
                                    console.log(`Error in getting the data from db: ${e}`);
                                });
                        })
                        .catch((e)=>{
                            console.log(`Error: ${e}`);
                        });
                    })
                    .catch((e)=>{
                        console.log(`Error in saving the project in completedProjects collection: ${e}`);
                    });
                }
            })
            .catch((e)=>{
                console.log(`Error in getting the data from the onGoingProjects: ${e}`);
            });
        })
        .catch((e)=>{
            console.log(`Error in getting the data from project db: ${e}`);
        });
    }
}



exports.getAllProjects = (req,res)=>{
    newProject
    .find({})
    .then((data)=>{
        res.render('showProjects',{projects: data});
    })
    .catch((e)=>{
        console.log(`Error in getting the data from db: ${e}`);
    });
}