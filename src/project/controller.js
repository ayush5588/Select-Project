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

    const project = new newProject({
        uid: uid,
        userEmail: userEmail,
        title: title,
        description: description
    });

    project
    .save()
    .then((data)=>{
        res.json({response: data});
        console.log(data);
    })
    .catch((e)=>{
        console.log(`Issue in saving the data: ${e}`);
    })
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
            .find({project: new mongodb.ObjectID(project_id)}).count() > 0 
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
                            res.json({code: 1,message: `The status of project ${title} has been updated`});
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
                    // Inserting in the onGoing collection
                    var projectStarted = new onGoingProjects({
                        project: project_id
                    });
                    projectStarted
                    .save()
                    .then(()=>{
                        console.log(`The project ${title} has been inserted into the onGoingProjects collection`);
                        res.json({code: 1,message: `The status of project ${title} has been updated`});
                    })
                    .catch((e)=>{
                        console.log(`Error in saving the project in onGoingProjects collection: ${e}`);
                    });
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
            .find({project: new mongodb.ObjectID(project_id)}).count() > 0 
            .then((exists)=>{ 
                if(exists){
                    onGoingProjects
                    .deleteOne({project: new mongodb.ObjectID(project_id)})
                    .then(()=>{
                        console.log(`The project ${title} has been removed from the onGoingProjects collection`);
                        // Inserting in the onGoing collection
                        var projectStarted = new completedProjects({
                            project: project_id
                        });
                        projectStarted
                        .save()
                        .then(()=>{
                            console.log(`The project ${title} has been inserted into the completedProjects collection`);
                            res.json({code: 1,message: `The status of project ${title} has been updated`});
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
                    // Inserting in the onGoing collection
                    var projectStarted = new completedProjects({
                        project: project_id
                    });
                    projectStarted
                    .save()
                    .then(()=>{
                        console.log(`The project ${title} has been inserted into the completedProjects collection`);
                        res.json({code: 1,message: `The status of project ${title} has been updated`});
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
    
}