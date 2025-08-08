require('dotenv').config();
const User = require("../models/userModel");

// This is a recreation of the "authMiddleware.js" file
// This features STREAMLINED AUTH in order to handle more advanced permissions-based routing

// vv checks if user's session is logged in, otherwise sends 403 forbidden. Useful for API calls that should only fire for users that are logged in
async function validateIsLoggedIn(req, res, next)
{
    if (req.session.userId)
    {
        return next();
    }
    else
    {
        console.log('validateLogin: Auth failed! '+req.originalUrl);
        res.sendStatus(403); //403 forbidden
    }
}



