const User = require('../models/userModel')
const argon2 = require('argon2')
// non-snippet JWT
// const jwt = require('jsonwebtoken')
require('dotenv').config()

async function loginUser(req, res)
{
    try
    {
        //the request must contain a username or password
        const {username, password} = req.body;

        //find the target user based on entered username
        // let foundUser = await User.findOne({username});
        const foundUser = await User.findOne({
            //a little regular expression from chatgpt vvv :) 
            //makes query case insensitive
            username: { $regex: new RegExp(`^${username}$`, "i") },
        });

        if (!foundUser)
        {
            return res.redirect("/login?loginerror=true");
        }

        //verify the password is correct
        const isCorrectPassword = await argon2.verify(foundUser.password, password);

        if (isCorrectPassword) 
        {
            console.log(username+' successfully verified password!');
            //if password matches, set session userId to the database's secret user ID...
            req.session.userId = foundUser._id;
            //this means, if the _id is discovered, a user could impersonate a valid session!

            // res.redirect('/');
            
            let redirectTo;
            if (req.session.returnTo)
            {
                //if user was trying to go somewhere else, they will be redirected back upon successful auth
                redirectTo = req.session.returnTo;
            }
            else
            {
                //the default redirection location is set in .env
                redirectTo = process.env.REDIRECT_AFTER_LOGIN
            }

            res.redirect(redirectTo);
        } else {

            return res.redirect("/login?loginerror=true");
            // return res.json({
            //     message: "function excecuted properly",
            //     payload: "Password could not be verified.. :) TRY AGAIN"
            // });
        }

    } catch (error) {
        let errorObj = {
            message: "loginUser failed",
            payload: error
        }
        console.error(errorObj);
        res.send("LOGIN FUNCTION FAILED :) TRY AGAIN (contact admin if you see this, you really shouldn't be seeing this...");
    }
}

//attaches activeUser to the session
async function attachUserObjectToSession(req, res, next)
{
    try 
    {
        if (req.session && req.session.userId) 
        {
            req.session.activeUser = await User.findOne({_id: req.session.userId});

            //yeah, I know session variables are stored server side...
            // vv changes the password into an empty string just in case
            req.session.activeUser.password = "";
        }
        else 
        {
            // THIS is so important-- if there is no active user (even if it is just null), then page crashes when ejs tries to build it!
            //so this variable MUST be null at least
            req.session.activeUser = null;
        }

        res.locals.activeUser = req.session.activeUser;
        return next();
    } catch (error) {
        let errorObj = {
            message: "attachUserObjectToSession middleware failed",
            payload: error
        }

        console.error(errorObj);
        res.send("Failed to link user and session! Let the admin know...");
    }
}

async function logoutUser(req, res)
{
    try
    {
        req.session.destroy( err => {
            if (err)
            {
                res.redirect("/");
            }
            res.redirect("/login");
        });

        res.clearCookie("Session-ID"); //name of session cookie set in index.js
    } catch (error) {
        let errorObj = {
            message: "logoutUser failed",
            payload: error
        }
        console.error(errorObj);
        res.send("LOGOUT FAILED :( TRY AGAIN?");
    }
}

async function createNewUser(req, res)
{   
    try {
        //plain means plaintext.. you want to encrypt before saving a password anywhere!
        let passwordPlain = req.body.password;
        let username = req.body.username;
        
        const encryptedPassword = await argon2.hash(passwordPlain);

        let newUser = {
            username: username,
            password: encryptedPassword
        }
        await User.create(newUser);
        
        res.redirect("/souls");
    }
    catch (error)
    {
        console.log(error);
        res.send("Yo createNewUser broke!!!");
    }
}

async function sendUsersToWebpage(req, res)
{
    try 
    {
        const allUsers = await User.find({});

        allUsers.forEach((user) => {
            user.password = "";
        });

        return res.status(200).json(allUsers);
    }
    catch (error) 
    {
        console.error(error);
        res.status(500).send("An error occured while trying to fetch user data... contact an admi- wait, you should already be an admin!!");
    }
}

async function changeUserPassword(req, res)
{
    const targetUsername = req.params.username;

    let newPasswordPlain = req.body.newPassword;

    try
    {
        const targetUser = await User.findOne({username: targetUsername});
        
        if (!targetUser)
        {
            return res.status(404).send("No such user found..");
        }

        const encryptedPassword = await argon2.hash(newPasswordPlain);

        targetUser.password = encryptedPassword;

        await targetUser.save();

        res.status(200).send("Password successfully changed for user "+targetUser.username);
    }
    catch (error) 
    {
        console.error(error);
        res.status(500).send("An error occured while trying to change the user's password... contact an admi- wait, you should already be an admin!!");
    }
}

async function toggleIsFrozen(req, res)
{
    const targetUsername = req.params.username;

    try
    {
        const targetUser = await User.findOne({username: targetUsername});
        
        if (!targetUser)
        {
            return res.status(404).send("No such user found..");
        }

        targetUser.isFrozen = !targetUser.isFrozen;

        await targetUser.save();

        res.status(200).redirect("/souls");
    }
    catch (error) 
    {
        console.error(error);
        res.status(500).send("An error occured while trying to toggle the frozen status of this user...");
    }
}

async function toggleIsCurator(req, res)
{
    const targetUsername = req.params.username;
    
    try
    {
        const targetUser = await User.findOne({username: targetUsername});
        
        if (!targetUser)
        {
            return res.status(404).send("No such user found..");
        }

        targetUser.isCurator = !targetUser.isCurator;

        await targetUser.save();

        res.status(200).redirect("/souls");
    }
    catch (error) 
    {
        console.error(error);
        res.status(500).send("An error occured while trying to toggle the Curator status of this user...");
    }
    
}

async function toggleIsUploader(req, res)
{
    const targetUsername = req.params.username;
    
    try
    {
        const targetUser = await User.findOne({username: targetUsername});
        
        if (!targetUser)
        {
            return res.status(404).send("No such user found..");
        }

        targetUser.isUploader = !targetUser.isUploader;

        await targetUser.save();

        res.status(200).redirect("/souls");
    }
    catch (error) 
    {
        console.error(error);
        res.status(500).send("An error occured while trying to toggle the Uploader status of this user...");
    }
}

module.exports = {
    loginUser,
    logoutUser,
    attachUserObjectToSession,
    createNewUser,
    sendUsersToWebpage,
    changeUserPassword,
    toggleIsFrozen,
    toggleIsUploader,
    toggleIsCurator
}