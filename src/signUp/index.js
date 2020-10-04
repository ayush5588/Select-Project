const express = require('express');
const router = express.Router();
const controller = require('./controller');

router.route('/signup').get((req,res)=>{res.render('signUp')}).post(controller.signup);

module.exports = router;