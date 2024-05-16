import passport from 'passport';
// import jwt from "jsonwebtoken";
import * as bcrypt from 'bcrypt'
import * as passportStrategy from 'passport-local';
import { Request, Response, NextFunction } from 'express';
import { apiError } from '../utils/handler';
import { messageKeys } from '../utils/enums';
import { HttpStatusCode } from '../utils/httpStatusCode';
import { UserModelFromOtherDB } from '../user/user';

const { UNAUTHORIZED, BAD_REQUEST } = HttpStatusCode;
const { notLoggedIn, internalError, notAllowed } = messageKeys;

  passport.use(
    new passportStrategy.Strategy({ 
      usernameField: 'email',  
      passwordField: 'password',
      passReqToCallback: true 
    }, async (req, email, password, done:any) => {
      try {
        if (!email || !password) done(null, false);
        const user = await UserModelFromOtherDB.findOne({email}).lean();
        console.log(user)
        if (!user) done(null, false, { message: 'User does not exists.' });
        if (!user?.password || !await bcrypt.compare(password, user?.password)) done(null, user);
        else done(null, false, { message: 'Invalid Credentials' });
      } catch (e) {
        return done(null,e);
      }
    }),
  );

  passport.serializeUser((user: any, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await UserModelFromOtherDB.findById(id)
      .populate("role", "roleName")
      .populate("cart.grocery", 'name price' )
      .lean();
      if (!user) return done(null, null);
      return done(null, user);
    } catch (err) {
      return done(err, null);
    }
  });

export function isAuthenticated(req: Request, res: Response, next: NextFunction): Response | void {
  if (!req?.isAuthenticated()) throw apiError(UNAUTHORIZED, notLoggedIn);
  next();
}

