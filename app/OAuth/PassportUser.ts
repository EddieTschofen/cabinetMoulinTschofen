export type PassportUser = {
   id: string,
   name: string,
   token: any,
   emails: string[],
   photos: string[],
   provider: "facebook" | "google";
};

const passportUsers = new Map<string, PassportUser>();



export function RegisterOAuth(app: Application) {
   passport.serializeUser( (user: PassportUser, done) => {
       passportUsers.set(user.id, user);
       done(null, user.id);
   });
   passport.deserializeUser( (id: string, done) => {
       const user = passportUsers.get(id);
       done(null, user ? user : false );
   });
}