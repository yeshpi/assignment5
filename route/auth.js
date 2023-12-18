const express=require('express');
const authController=require('../controllers/auth');

const route=express.Router()

route.get('/login',authController.getlogin)
route.post('/login',authController.postlogin)
route.get('/singout',authController.getSignout)
route.get('/signup',authController.getSignup)
route.post('/signup',authController.postSignup)




module.exports=route
