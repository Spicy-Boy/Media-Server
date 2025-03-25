// const jwt = require('jsonwebtoken');
require('dotenv').config()
const User = require("../models/userModel");

const redirectLogin = (req, res, next) => {
    if (!req.session.userId) 
    {
        console.log('Auth failed!');
        // req.session.loginMessage = "Validate your login, scrubby";
        console.log(req.originalUrl);
        //attaches the place they are being redirected from to the session. So, if they log in, they can be redirected BACK to where they were originally trying to go! vv
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

async function validateLogin (req, res, next)
{
    if (req.session.userId)
    {
        return next();
    }
    else
    {
        res.sendStatus(403); //403 forbidden
    }
}

//adminAuth checks a specific isAdmin variable inside the user object, nothing more
async function adminAuth (req, res, next) 
{
    try 
    {
        const userInQuestion = await User.findOne({_id: req.session.userId});
        
        if (userInQuestion.isAdmin)
        {
            //admin authorized ;p
            return next();
        }
        else
        {
            res.send(`<center><h1 style="color: red">:)</h1></center>`);
        }
    }
    catch (error)
    {
        console.error("Something went wrong with admin auth!", error);
        res.send("<center><h1>:'( call aaron</h1></center>");
    }
}

module.exports = {
    redirectLogin,
    redirectIfLoggedIn,
    redirectLoginConditionally,
    validateLogin,
    adminAuth
};
