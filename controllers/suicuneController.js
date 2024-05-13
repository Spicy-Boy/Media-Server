

async function uploadOneFile(req, res)
{
    console.log(req.file);
    res.redirect("/mail");
}

module.exports = {
    uploadOneFile
};