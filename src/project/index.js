const express = require('express');
const router = express.Router();
const controller = require('./controller');

router.route('/add').get((req,res)=>{res.render('addProject')}).post(controller.addProject);
router.route('/updateStatus').post(controller.updateStatus);
router.route('/all').get((req,res)=>{res.render('showProjects')}).post(controller.getAllProjects);
router.route('/suggest').post(controller.suggestProject);
router.route('/userMain').get((req,res)=>{res.render('userMain')});

module.exports = router;