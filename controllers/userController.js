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
        let foundUser = await User.findOne({username});

        //verify the password is correct
        const isCorrectPassword = await argon2.verify(foundUser.password, password);

        if (isCorrectPassword) 
        {
            console.log(username+' successfully verified password!');
            //if password matches, set session userId to the database's secret user ID...
            req.session.userId = foundUser._id;
            //this means, if the _id is discovered, a user could impersonate a valid session!

            // res.redirect('/');
            res.redirect(process.env.REDIRECT_AFTER_LOGIN);
        } else {
            res.json({
                message: "function excecuted properly",
                payload: "Password could not be verified.. :) TRY AGAIN"
            });
        }

    } catch (error) {
        let errorObj = {
            message: "loginUser failed",
            payload: error
        }
        console.error(errorObj);
        res.send("LOGIN FAILED :) TRY AGAIN");
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

module.exports = {
    loginUser,
    logoutUser,
    attachUserObjectToSession
}