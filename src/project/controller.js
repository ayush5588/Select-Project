const shortID = require('shortid');
const newProject = require('../../model/project').newProject;
const onGoingProjects = require('../../model/project').onGoingProjects;
const completedProjects = require('../../model/project').completedProjects;


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
    project.save().then((data)=>{
        res.json({response: data});
        console.log(data);
    }).catch((e)=>{
        console.log(`Issue in saving the data: ${e}`);
    })
}

exports.updateStatus = (req,res)=>{
    
}

exports.getAllProjects = (req,res)=>{

}