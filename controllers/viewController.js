async function renderHomepage(req, res)
{
    try {
        res.render("homepage");
    } catch (error) {
        let errorObj = {
            message: "renderHomepage failed",
            payload: error
        }
        console.error(errorObj);
        res.json("SORRY! Something went wrong loading the homepage.");
    }

}

module.exports = {
    renderHomepage
}