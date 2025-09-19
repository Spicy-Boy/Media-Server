const User = require('../models/userModel');

async function renderHomePage(req, res)
{
    try {
        res.render("homePage");
    } catch (error) {
        let errorObj = {
            message: "renderHomePage failed",
            payload: error
        }
        console.error(errorObj);
        res.json("SORRY! Something went wrong loading the homePage.");
    }
}

async function renderLoginPage(req, res)
{
    try {
        res.render("loginPage");
    } catch (error) {
        let errorObj = {
            message: "renderLoginPage failed",
            payload: error
        }
        console.error(errorObj);
        res.json("SORRY! Something went wrong loading the loginPage.");
    }
}

async function renderUserIndexPage(req, res)
{
    try {
        const {username} = req.params;

        let targetUser;

        if (!req.params.username) //if simple /u route with no specific user parameter
        {
            targetUser = req.session.activeUser;
        }
        else
        {
            targetUser = await User.findOne({ username });
        }

        if (targetUser)
        {
            targetUser.password = ""; //for safety, idk if this matters
            res.render("userPortal", {targetUser});
        }
        else
        {
            res.send("<center><h1>USERNAME "+username+" COULD NOT BE FOUND</h1></center>")
        }
    } catch (error) {
        let errorObj = {
            message: "userIndexPage failed",
            payload: error
        }
        console.error(errorObj);
        res.json("SORRY! Something went wrong loading the userIndexPage.");
    }
}

// vvv FILE UPLOADING mostly testing junk routes
async function renderSuicuneDeliveryPage(req, res)
{
    try {
        
        res.render("suicuneDeliveryPage");
    } catch (error) {
        let errorObj = {
            message: "renderSuicuneDeliveryPage failed",
            payload: error
        }
        console.error(errorObj);
        res.json("SORRY! Something went wrong loading the Suicune Mail Delivery Service.");
    }
}
//vv the Before Semicolon chunked upload test
async function renderSuicuneDeliveryPageBusboy(req, res)
{
    try {
        res.render("suicuneDeliveryPageBusboy");
    } catch (error) {
        let errorObj = {
            message: "renderSuicuneDeliveryPageBusboy failed",
            payload: error
        }
        console.error(errorObj);
        res.json("SORRY! Something went wrong loading the Suicune Mail Delivery Service with Busboy.");
    }
}
//vv Aaron's simplified version
async function renderSuicuneDeliveryPageSimpleBusboy(req, res)
{
    try {
        res.render("suicuneDeliveryPageSimpleBusboy");
    } catch (error) {
        let errorObj = {
            message: "renderSuicuneDeliveryPageSimpleBusboy failed",
            payload: error
        }
        console.error(errorObj);
        res.json("SORRY! Something went wrong loading the Suicune Mail Delivery Service with Simple Busboy.");
    }
}

async function renderIndividualFilePage (req, res)
{
    {
        try {
            const {username} = req.params;
    
            let targetUser;
    
            if (!req.params.username) //if simple /u route with no specific user parameter
            {
                targetUser = req.session.activeUser;
            }
            else
            {
                targetUser = await User.findOne({ username });
            }

            const file = targetUser.files.find( file => file.fileId === req.params.fileId);
    
            if (targetUser && file)
            {
                targetUser.password = ""; //for safety, though it barely matters
                res.render("individualPersonalFilePage", {targetUser, file});
            }
            else
            {
                res.send("<center><h1>USERNAME OR FILE ID COULD NOT BE FOUND</h1></center>")
            }
        } catch (error) {
            let errorObj = {
                message: "individualPersonalFilePage failed",
                payload: error
            }
            console.error(errorObj);
            res.json("SORRY! Something went wrong loading the individualPersonalFilePage.");
        }
    }
}

async function renderAdminFunPanel(req, res)
{
    try {
        const allUsers = await User.find({});
        res.render("adminFunPanel", {allUsers});

    } catch (error) {
        let errorObj = {
            message: "renderAdminFunPanel failed",
            payload: error
        }
        console.error(errorObj);
        res.json("SORRY! Something went wrong loading the adminFunPanel.");
    }
}

async function renderUserManagementPanel(req, res)
{
    try {
        const allUsers = await User.find({});
        res.render("adminUserManagementPanel", {allUsers});

    } catch (error) {
        let errorObj = {
            message: "renderAdminUserManagementPanel failed",
            payload: error
        }
        console.error(errorObj);
        res.json("SORRY! Something went wrong loading the adminUserManagementPanel.");
    }
}

async function renderBasicImageHub(req, res)
{
    try 
    {
        const {username} = req.params;

        let targetUser;

        targetUser = await User.findOne({ username });

        if (targetUser)
        {
            targetUser.password = ""; //client doesnt actually see targetUser, the render engine that builds the ejs html does!
            targetUser.files = null;
            res.render("imageHubBasic", {targetUser});
        }
    } catch (error)
    {
        console.error(errorObj);
        res.json("SORRY! Something went wrong loading the renderBasicImageHub.");
    }
}

module.exports = {
    renderHomePage,
    renderLoginPage,
    renderSuicuneDeliveryPage,
    renderSuicuneDeliveryPageBusboy,
    renderSuicuneDeliveryPageSimpleBusboy,
    renderUserIndexPage,
    renderIndividualFilePage,
    renderAdminFunPanel,
    renderUserManagementPanel
}