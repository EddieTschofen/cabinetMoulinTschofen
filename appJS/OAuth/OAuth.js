"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const passport = require("passport");
const PassportUser_1 = require("@OAuth//PassportUser");
function RegisterOAuth(app) {
    passport.serializeUser((user, done) => {
        PassportUser_1.passportUsers.set(user.id, user);
        done(null, user.id);
    });
    passport.deserializeUser((id, done) => {
        const user = PassportUser_1.passportUsers.get(id);
        done(null, user ? user : false);
    });
}
exports.RegisterOAuth = RegisterOAuth;
function getOrCreateUser(user) {
    let usr = PassportUser_1.passportUsers.get(user.id);
    if (usr === undefined) {
        usr = passport.serializeUser(usr);
        return usr;
    }
    else {
        return usr;
    }
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
