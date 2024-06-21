const fs = require("fs");
const path = require("path");
const busboy = require("busboy");
const { v4: uuidv4 } = require('uuid');

// const {promisify} = require('util');
// const getFileDetails = promisify(fs.stat);

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
    if (req.query && req.query.fileName && req.query.fileId) 
    {
        getFileDetails(getPathToFile(req.query.fileName,req.query.fileId))
            .then( stats => {
                res.status(200).jason({totalChunksUploaded: stats.size})
            })
            .catch(e => {
                console.error('Failed to read file', e);
                return res.status(404).json({
                    message: "No file provided with credentials",
                    credentials: {...req.query}
                });
            })
    }
    else 
    {
        return res.status(400).json({
            message: "No file provided with credentials",
            credentials: {...req.query}
        });
    }
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
    console.log('-- manageUploadRequest accessed');
    if (!req.body || !req.body.fileName)
    {
        console.log('!! failure dingito, !req.body or !fileName');
        res.status(400).json({message:"Missing file name!"});
    } 
    else
    {
        console.log('!! successful dingito');
        const fileId = uniqueAlphaNumericId();
        fs.createWriteStream(getPathToFile(req.body.fileName, fileId), {flags: 'w'});
        res.status(200).json({fileId, fileName: req.body.fileName}); //send id and name back
    }
}

function manageUpload(req, res)
{
    console.log('-- manageUpload accessed');
    const contentRange = req.headers['content-range'];
    const fileId = req.headers['x-file-id'];

    if (!contentRange)
    {
        return res.status(400).json({message: "Missing 'Content-Range' header"})
    }
    if (!fileId)
    {
        return res.status(400).json({message: "Missing 'X-File-Id' header"})
    }

    const match = contentRange.match(/bytes=(\d+)-(\d+)\/(\d+)/);
    if (!match)
    {
        return res.status(400).json({message: "Invalid 'Content-Range' format"})
    }

    const rangeStart = Number(match[1]);
    const rangeEnd = Number(match[2]);
    const fileSize = Number(match[3]);

    //check to make sure numbers make sense
    if (rangeStart >= fileSize || rangeStart >= rangeEnd || rangeEnd > fileSize)
    {
        return res.status(400).json({message: "Invalid 'Content-Range' provided"});
    }

    //begin actual upload!

    const busBoy = busboy({headers: req.headers});

    busBoy.on('error', e => {
        console.error('Failed to read file',e);
        res.sendStatus(500);
    });

    busBoy.on('finish', e => {
        res.sendStatus(200);
    });

    busBoy.on('file', (_, file, fileName) => {
        const filePath = getPathToFile(file.filename, fileId);

        getFileDetails(filePath)
        .then(stats => {
            if (stats.size !== rangeStart)
            {
                return res.status(400).json({message: "Bad Chunk Range Start"})
            }

            file.pipe(fs.createWriteStream(filePath, {flags: 'a'}));
        })
        .catch(e => {
            console.error("failed to read file", e);
            return res.status(400).json({message: "No file with provided credentials", credentials: {
                fileId,
                fileName
            }});
        });
    });

    req.pipe(busBoy);
}

function simpleUpload(req, res)
{
    console.log('SIMPLE UPLOAD CALLED! HI AARON!!');
    const busBoy = busboy({headers: req.headers});

    busBoy.on('error', e => {
        console.error('Failed to read file',e);
        res.sendStatus(500);
    });

    busBoy.on('finish', e => {
        res.sendStatus(200);
    });

    //upon recieving the file, set save location
    //begin write stream using fs
    busBoy.on('file', (fieldname, file, filename) => {

        console.log("file:",filename);
        //the .env location is the simple mailbox. More advanced routing will be implemented later
        const filePath = process.env.MAIL_DELIVERY_LOCATION+filename.filename
        console.log('filepath:',filePath);

        //unused vv error detection null path
        // if (!filePath) {
        //     console.error('MAIL_DELIVERY_LOCATION not set in environment variables');
        //     res.sendStatus(500);
        //     return;
        // }

        const writeStream = fs.createWriteStream(filePath, {flags: 'w'})

        file.pipe(writeStream);

        //error handling for back end writing file
        writeStream.on('error', (err) => {
            console.error('Failed to write file:', err);
            res.sendStatus(500);
        });

        writeStream.on('finish', () => {
            console.log('File successfully written:', filename);
        });

    });

    req.pipe(busBoy);
}

module.exports = {
    uploadOneFile,
    uploadWithBusboy,
    uploadWithXMLHttpRequest,
    manageUploadStatus,
    manageUploadRequest,
    manageUpload,
    simpleUpload
};