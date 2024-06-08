const fs = require("fs");
const path = require("path");
const busboy = require("busboy");
const { v4: uuidv4 } = require('uuid');

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
    res.send("Hello :)");
}

// vv generates a unique ID, code by Before Semicolon
const uniqueAlphaNumericId = (() => {
    const uniqueId = uuidv4();
    return uniqueId;
});

// vv for test purposes, putting the id in the file name to keep track
function getPathToFile(fileName, fileId) 
{
    //in full implementation, we will likely register with a database
    return "./public/uploads/file-"+fileId+"-"+fileName;
}

function manageUploadRequest(req, res)
{
    console.log('HI AARON! manageUploadRequest accessed');
    if (!req.body || !req.body.fileName)
    {
        console.log('!req.body or !fileName');
        res.status(400).json({message:"Missing file name!"});
    } 
    else
    {
        const fileId = uniqueAlphaNumericId();
        fs.createWriteStream(getPathToFile(req.body.fileName, fileId), {flags: 'w'});
        res.status(200).json({fileId, fileName: req.body.fileName}); //send id and name back
    }
}

module.exports = {
    uploadOneFile,
    uploadWithBusboy,
    uploadWithXMLHttpRequest,
    manageUploadStatus,
    manageUploadRequest
};