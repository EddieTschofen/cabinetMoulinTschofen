import {Router} from "express";
import * as passport from "passport";
import {OAuth2Strategy as GoogleStrategy} from "passport-google-oauth";
import {getOrCreateUser} from "@OAuth/OAuth";
import {PassportUser} from "@OAuth/PassportUser";


export function initOAuthGoogle(config: {GOOGLE_CLIENT_ID: string, GOOGLE_CLIENT_SECRET: string}): Router {
    const {GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET} = config;
    passport.use(new GoogleStrategy({
            clientID: GOOGLE_CLIENT_ID,
            clientSecret: GOOGLE_CLIENT_SECRET,
            callbackURL: `/auth/google/callback`
        },
        (accessToken, refreshToken, profile, done: (err: any, user: PassportUser) => any) => {
            const emails = profile.emails || [];
            const photos = profile.photos || [];
            const user: PassportUser = {
                name: profile.displayName,
                id: profile.id,
                token: accessToken,
                emails: emails.map(val => val.value),
                photos: photos.map(val => val.value),
                provider: "google"
            };
            getOrCreateUser(user); // Vous devez implémenter cette fonction
            done(null, user);
        }
    ));

    const routerGooglePassport: Router = Router();

    routerGooglePassport.get("/auth/google",
        (request, response, next) => {
            passport.authenticate("google", {scope: ["profile", "email"]})(request, response, next);
        }
    );

    routerGooglePassport.get(
        "/auth/google/callback",
        (request, response, next) => {
            passport.authenticate("google", {
                    failureRedirect: "/login",
                    successRedirect: "/"
                }
            )(request, response, next);
        }
    );

    return routerGooglePassport;
}
