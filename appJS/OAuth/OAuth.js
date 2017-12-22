"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const passport = require("passport");
const PassportUser_1 = require("@OAuth//PassportUser");
const OAuthGoogle_1 = require("@OAuth/OAuthGoogle");
function RegisterOAuth(app) {
    passport.serializeUser((user, done) => {
        let usr = PassportUser_1.passportUsers.set(user.id, user);
        if (done)
            done(null, user.id);
        return usr;
    });
    passport.deserializeUser((id, done) => {
        const user = PassportUser_1.passportUsers.get(id);
        if (done)
            done(null, user ? user : false);
    });
    let configGoogle = {
        GOOGLE_CLIENT_ID: "1054178353181-8l4urm2hkek8vmr9q2av4uqpbdgde88a.apps.googleusercontent.com",
        GOOGLE_CLIENT_SECRET: "759FeS5Egj5J_0Y8WqC1qWWB"
    };
    return OAuthGoogle_1.initOAuthGoogle(configGoogle);
}
exports.RegisterOAuth = RegisterOAuth;
function getOrCreateUser(user) {
    let usr = PassportUser_1.passportUsers.get(user.id);
    if (usr === undefined) {
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
exports.getOrCreateUser = getOrCreateUser;
// Check if client is authentified
function checkIsAuthentified(statusIfFailed, ressourceIfFailed) {
    return (req, res, next) => {
        if (req.isAuthenticated()) {
            next();
        }
        else {
            res.status(statusIfFailed);
            if (typeof ressourceIfFailed === "string") {
                res.redirect(ressourceIfFailed);
            }
            else {
                res.json({ error: "YOU ARE NOT LOGGED IN" });
            }
        }
    };
}
exports.checkIsAuthentified = checkIsAuthentified;
