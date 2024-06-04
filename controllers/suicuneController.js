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

module.exports = {
    uploadOneFile,
    uploadWithBusboy
};