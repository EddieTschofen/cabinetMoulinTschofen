"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
