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

