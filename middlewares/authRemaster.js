require('dotenv').config();
const argon2 = require('argon2')
const User = require("../models/userModel");

// This is a recreation of the "authMiddleware.js" file
// This features STREAMLINED AUTH in order to handle more advanced permissions-based routing

// loginAndAttachUserToSession (previously, loginUser and attachUserObjectToSession)
// verifies password is correct
// if so, attach the user's id and files/permissions to the session to validate logged-in status
async function loginAndAttachUserToSession(req, res)
{
    try 
    {
        const {username, password} = req.body; //grab username and password (plaintext) from the request

        const user = await User.findOne({ //query db
            // vv regex to make username query case insensitive
            username: { $regex: new RegExp(`^${username}$`, "i") }, 
        });

        if (!user)
        {
            return res.redirect("/login?loginerror=true"); //location: masterRouter.js
        }

        if (user.isFrozen) //prevent login if user has been frozen
        {
            return res.status(403).send("<center>🥶</center>")
        }

        const isPasswordCorrect = await argon2.verify(user.password, password);

        if (isPasswordCorrect)
        {
            console.log(username+' successfully verified password!');

            // userId is attached here-- it is used to verify that the user is logged in through most routes vvv LOGIN GRANTED!
            req.session.userId = user._id;
            
            //cleanse user object and attach useful variables including files
            user.password = null;
            req.session.activeUser = user;

            if (req.session.returnTo)
            {
                let redirectTo = req.session.returnTo;
                req.session.returnTo = null;
                return res.redirect(redirectTo);
            }

            return res.redirect("/redirectLogin"); //redirectLogin is like grand central station, it is inside masterRouter.js
        }
        else
        {
            return res.redirect("/login?loginerror=true");
        }
    }
    catch(error)
    {
        console.error("loginAndAttachUserToSession failed! ",error);
        return res.status(500).send("Something went wrong trying to log in!");
    }
}

async function logoutUser(req, res)
{
    try
    {
        req.session.destroy( err => {
            if (err)
            {
                res.redirect("/login");
            }
        });

        return res.clearCookie("Session-ID").redirect("/login");; //name of session cookie set in index.js
    } catch (error) {
       
        console.error("Logout function failed?!",error);
        res.send("LOGOUT FAILED?? :( CONTACT THE ADMIN PLEASE!!!");
    }
}

// vv checks if user's session is logged in, otherwise sends 403 forbidden.
async function validateLogin(req, res, next) //FOR API
{
    if (req.session.userId)
    {
        //user session authorized
        return next();
    }
    else
    {
        console.log('validateIsLoggedIn: Auth failed! '+req.path);
        res.sendStatus(403); //403 forbidden
    }
}

async function validateLoginWithRedirect(req, res, next) //FOR VIEWS/PAGES
{
    if (req.session.userId)
    {
        if (req.path == "/login") //redirects already logged in users away from /login
        {
            return res.redirect("/redirectLogin");
        }

        //user session authorized
        return next();
    }
    else
    {
        console.log('validateLoginWithRedirect: Auth failed! '+req.path);

        req.session.returnTo = req.path; //save where the user was going!

        return res.status(403).redirect("/redirectLogin"); //403 forbidden
    }
}

// vv updates a user's session permissions and files based on information from the database
// later in the chain, these permissions may be checked to grant or deny access to a route
async function updateUserPermissionsAndFiles(req, res, next) //FOR API and VIEWS/PAGES
{
    try
    {
        const user = await User.findOne({_id: req.session.userId}); //ASSUMES user is already logged in

        if (user.isFrozen)
        {
            return res.status(403).send("<center>🥶</center>")
        }

        user.password = null;
        req.session.activeUser = user;

        // vv prevents a crash when rendering activeUser sensitive pages
        res.locals.activeUser = req.session.activeUser;

        next();
    }
    catch (error)
    {
        console.error("updateUserPermissionsAndFiles failed! ",error);
        return res.status(500).send("Something went wrong!");
    }

}

// vv checks the database to see if the user in question 
async function validateAdminAuth (req, res, next) //FOR API
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
            console.log('validateAdminAuth: Auth failed! '+req.path);
            res.status(403).send(`<center><h1 style="color: red">:)</h1></center>`);
        }
    }
    catch (error)
    {
        console.error("Something went wrong with validateAdminAuth!", error);
        return res.status(500);
    }
}

// vv checks user session to validate uploader permissions
async function validateIsUploader(req, res, next)
{
    if (req.session.activeUser.isUploader)
    {
        return next();
    }
    else
    {
        console.log('validateIsUploader: Auth failed! '+req.path);
        res.status(403).send("<center><h1>:)</h1></center>"); //403 forbidden
    }
}

async function validateIsCurator(req, res, next)
{
    if (req.session.activeUser.isCurator)
    {
        return next();
    }
    else
    {
        console.log('validateIsCurator: Auth failed! '+req.path);
        res.status(403).send("<center><h1>:)</h1></center>"); //403 forbidden
    }
}

// vv used when viewing sharable file pages to identify if strangers online can bypass auth to view them
async function validateLoginConditionallyForFile (req, res, next) //FOR VIEWS/PAGES, contains redirect to login
{
    const fileId = req.params.fileId;
    const targetUsername = req.params.username;
    
    try 
    {
        const targetUser = await User.findOne({username: targetUsername});
        
        let targetFile = targetUser.files.find( file => file.fileId === fileId);
        
        if (targetFile)
        {
            if (req.session.userId && req.session.activeUser.isUploader)
            {
                res.locals.activeUser = req.session.activeUser;
                //the path is open!
                return next();
            }
            else if(targetFile.isPublic)
            {
                req.session.activeUser = null;
                res.locals.activeUser = req.session.activeUser;
                //needs to exist or crash happens
                return next();
            }

            console.log('validateLoginConditionallyForFile: Auth failed! '+req.path)+' !!! Redirecting';

            //attaches the user's original destination to their session so that they can be returned when successfully logging in
            req.session.returnTo = req.originalUrl;

            return res.redirect("/redirectLogin");

            // old vvv doesn't redirect, snarky
            // return res.status(403).send("<center><h1>:)</h1></center>");
        }
        else
        {
            res.status(404).send(`<center><h1>404</h1></center>`);
        }
    }
    catch (error)
    {
        console.error("Something went wrong with validateLoginConditionallyForFile!", error);
        return res.status(500);
    }
}

module.exports = {
    loginAndAttachUserToSession,
    logoutUser,
    validateLogin,
    validateLoginWithRedirect,
    validateLoginConditionallyForFile,
    updateUserPermissionsAndFiles,
    validateAdminAuth,
    validateIsCurator,
    validateIsUploader,
};





