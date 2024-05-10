const jwt = require('jsonwebtoken');
require('dotenv').config()

const redirectLogin = (req, res, next) => {
    if (!req.session.userId) 
    {
        console.log('Auth failed!');
        // req.session.loginMessage = "Validate your login, scrubby";
        res.redirect('/login');
    }
    else 
    {
        return next();
    }
};

module.exports = {
    redirectLogin
};
