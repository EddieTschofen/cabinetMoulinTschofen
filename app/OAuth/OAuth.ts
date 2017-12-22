import * as express from "express";
import * as passport from "passport";
import {PassportUser, passportUsers} from "@OAuth//PassportUser";
import {initOAuthGoogle} from "@OAuth/OAuthGoogle";

export function RegisterOAuth(app: express.Application) {
    passport.serializeUser( (user: PassportUser, done) => {
        let usr = passportUsers.set(user.id, user);
        if (done) done(null, user.id);
        return usr;
    });
    passport.deserializeUser( (id: string, done) => {
        const user = passportUsers.get(id);
        if (done) done(null, user ? user : false );
    });

    let configGoogle = {
        GOOGLE_CLIENT_ID : "1054178353181-8l4urm2hkek8vmr9q2av4uqpbdgde88a.apps.googleusercontent.com",
        GOOGLE_CLIENT_SECRET : "759FeS5Egj5J_0Y8WqC1qWWB"
    };
    return initOAuthGoogle(configGoogle);
}

export function getOrCreateUser(user: PassportUser) {
    let usr = passportUsers.get(user.id);
    if ( usr === undefined ) {
        usr = passport.serializeUser(user);
        return usr;
    }
    else {
        return usr;
    }



    /*
    passport.serializeUser(user);
    // console.log(user);
    // let usr = passportUsers.get(user.id);
    // if (usr === undefined) {
    //     usr = passport.serializeUser(user);
    // }
    // console.log(usr);
    // // return usr;*/
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

