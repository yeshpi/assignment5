const express=require('express');
const authController=require('../controllers/auth');

const route=express.Router()

route.get('/login',authController.getlogin)
route.post('/login',authController.postlogin)
route.post('/signout',authController.postSignout)
route.get('/signup',authController.getSignup)
route.post('/signup',authController.postSignup)
route.get('/reset',authController.getPasswordReset)
route.get('/reset/:tokenId',authController.getPasswordChange)
route.post('/reset',authController.postPasswordReset)
route.post('/new-password',authController.postChangePassword)




module.exports=route
