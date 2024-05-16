import express, { NextFunction, Response } from 'express';
import { isAuthenticated } from '../config/passport.config';
import { isLoggedIn, logout } from './controller';
const passport = require("passport");


const authRouter = express.Router();

const SUCCESS_URL = "login/success";
const ERROR_URL = "login/failed";

authRouter
  .get('/logout', isAuthenticated, logout)
  .get('/is-logged-in', isAuthenticated, isLoggedIn)
  .post('/login',  passport.authenticate('local', { 
    failureRedirect:  ERROR_URL,
    successRedirect: SUCCESS_URL,
    failureMessage: true,
  }))
  .get("/login/failed", (req: any,res: Response, next: NextFunction) => {
    return res.status(401).json({
        success:false,
        message: req.session?.messages[req.session?.messages?.length - 1],
    });
  })
  .get("/login/success", (req: any,res: Response, next: NextFunction) => {
    if (req.isAuthenticated()) {
      return res.status(200).json({
          success:true,
          message: "Login Successfully",
      });
    }
    return res.status(401).json({
      success:false,
      message: "Login Failed",
    });
  })


  authRouter

export default authRouter;
