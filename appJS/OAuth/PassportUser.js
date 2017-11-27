"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const passportUsers = new Map();
function RegisterOAuth(app) {
    passport.serializeUser((user, done) => {
        passportUsers.set(user.id, user);
        done(null, user.id);
    });
    passport.deserializeUser((id, done) => {
        const user = passportUsers.get(id);
        done(null, user ? user : false);
    });
}
exports.RegisterOAuth = RegisterOAuth;
