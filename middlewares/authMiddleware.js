// const jwt = require('jsonwebtoken');
require('dotenv').config()
const User = require("../models/userModel");

const redirectLogin = (req, res, next) => {
    if (!req.session.userId) 
    {
        console.log('Auth failed!');
        // req.session.loginMessage = "Validate your login, scrubby";
        console.log(req.originalUrl);
        req.session.returnTo = req.originalUrl;

        res.redirect('/login');
    }
    else 
    {
        return next();
    }
};

//vv used to determine if a user session is required to access a file upload page
//if the file is set to public access, the page will be displayed regardless
async function redirectLoginConditionally (req, res, next) {
    const fileId = req.params.fileId;
    const targetUsername = req.params.username;

    try 
    {
        const targetUser = await User.findOne({username: targetUsername});

        targetFile = targetUser.files.find( file => file.fileId === fileId);

        //conditional check occurs here, if file exists and (user is logged in OR file is public access)
        if (targetFile && (req.session.userId || targetFile.isPublic)) 
        {
            //the path is open!
            return next();
        }
        else 
        {
            console.log('Conditional Auth failed! File is not public access');
            // req.session.loginMessage = "Validate your login, scrubby";
            console.log(req.originalUrl);
            req.session.returnTo = req.originalUrl;
    
            res.redirect('/login');
        }
    }
    catch (error)
    {
        console.error(error);
        res.send("<center>???</center>");
    }
};

const redirectIfLoggedIn = (req, res, next) => {
    if (req.session.userId)
    {
        res.redirect("/");
    }
    else
    {
        return next();
    }
}

module.exports = {
    redirectLogin,
    redirectIfLoggedIn,
    redirectLoginConditionally
};
