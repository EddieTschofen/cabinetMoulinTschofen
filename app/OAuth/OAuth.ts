import * as express from "express";
import * as passport from "passport";
import {PassportUser, passportUsers} from "@OAuth//PassportUser";

export function RegisterOAuth(app: express.Application) {
    passport.serializeUser( (user: PassportUser, done) => {
        passportUsers.set(user.id, user);
        done(null, user.id);
    });
    passport.deserializeUser( (id: string, done) => {
        const user = passportUsers.get(id);
        done(null, user ? user : false );
    });
}

export function getOrCreateUser(user: PassportUser) {
    let usr = passportUsers.get(user.id);
    if (usr === undefined) {
        usr = passport.serializeUser(usr);
        return usr;
    }
    else {
        return usr;
    }
}

// Check if client is authentified
export function checkIsAuthentified(statusIfFailed: number, ressourceIfFailed: string | JSON) {
   return (req, res, next) => {
       if (req.isAuthenticated()) { // if user is authenticated in the session, carry on
           next();
       } else { // Error 401 if not authentified
           res.status(statusIfFailed);
           if (typeof ressourceIfFailed === "string") {
               res.redirect(ressourceIfFailed);
           } else {
               res.json({error: "YOU ARE NOT LOGGED IN"});
           }
       }
   };
}

