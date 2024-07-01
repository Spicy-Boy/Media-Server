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
        res.render("userPortal");
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

module.exports = {
    renderHomePage,
    renderLoginPage,
    renderSuicuneDeliveryPage,
    renderSuicuneDeliveryPageBusboy,
    renderSuicuneDeliveryPageSimpleBusboy,
    renderUserIndexPage
}