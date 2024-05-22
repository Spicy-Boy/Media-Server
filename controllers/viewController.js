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

module.exports = {
    renderHomePage,
    renderLoginPage,
    renderSuicuneDeliveryPage
}