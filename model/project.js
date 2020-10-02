const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const NewProject = new Schema({
    uid: {type: String, unique: true, required: true},
    userEmail: {type: String,required: true},
    title: {type: String, unique: true, required: true},
    description: {type: String},
    status: {type: Number,required: true}   // 0 = Added,  1 = started,  2 = completed
},{timestamps: true});

const OnGoingProjects = new Schema({
    project: [{type: mongoose.Schema.ObjectId,ref: 'addProject'}]
},{timestamps: true});

const CompletedProjects = new Schema({
    project: [{type: mongoose.Schema.ObjectId,ref: 'addProject'}]
},{timestamps: true});



const newProject = mongoose.model('NewProject',NewProject);
const onGoingProjects = mongoose.model('OnGoingProject',OnGoingProjects);
const completedProjects = mongoose.model('CompletedProjects',CompletedProjects);

module.exports = {
    newProject,
    onGoingProjects,
    completedProjects
};
