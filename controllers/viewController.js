async function renderHomepage(req, res)
{
    try {
        res.render("homepage");
    } catch (error) {
        let errorObj = {
            message: "renderHomepage failed",
            payload: error
        }
        console.log(errorObj);
        res.json(errorObj);
    }

}

module.exports = {
    renderHomepage
}