const express = require('express');
const router = express.Router();
const controller = require('./controller');

router.route('/add').get((req,res)=>{res.render('addProject')}).post(controller.addProject);
router.route('/updateStatus').post(controller.updateStatus);
router.route('/all').get((req,res)=>{res.render('showProjects')}).post(controller.getAllProjects);

module.exports = router;