const fs = require("fs");
const path = require("path");

async function uploadOneFile(req, res)
{
    console.log(req.file);
    res.redirect("/mail");
}

async function uploadWithBusboy(req, res)
{

}

module.exports = {
    uploadOneFile,
    uploadWithBusboy
};