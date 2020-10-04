const express = require('express');
const router = express.Router();
const controller = require('./controller');

router.route('/login').get((req,res)=>{res.render('login')}).post(controller.login);
router.route('/logout').post(controller.logout);

module.exports = router;