const fs = require("fs");
const path = require("path");
const busboy = require("busboy");

async function uploadOneFile(req, res)
{
    console.log(req.file);
    res.redirect("/mail");
}

async function uploadWithBusboy(req, res)
{
    /* vv OLD busboy functionality, its basically multer */
    let filename = "";

    const bb = busboy({
        headers: req.headers
    });

    bb.on("file", (name,file,info) => {
        let filename = info.filename;
        const saveTo = "./public/uploads/"+filename;

        file.pipe(fs.createWriteStream(saveTo));
    });

    bb.on("close", () => {
        res.send("FILE UPLOADED!");
    });

    //send the bb down the pipe ;)
    req.pipe(bb);
}

async function uploadWithXMLHttpRequest(req, res) 
{
    res.send("HIIIII :D");
}

//check the status of an upload to the server
function manageUploadStatus(req, res)
{

}

function manageUploadRequest(req, res)
{
    if (!req.body || !req.body.fileName)
    {
        res.status(400).json({message: "Missing file name!"});
    }
}

module.exports = {
    uploadOneFile,
    uploadWithBusboy,
    uploadWithXMLHttpRequest,
    manageUploadStatus,
    manageUploadRequest
};