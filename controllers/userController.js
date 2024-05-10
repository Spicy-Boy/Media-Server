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

            res.redirect('/');
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
    logoutUser
}