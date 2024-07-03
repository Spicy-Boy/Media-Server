const fs = require("fs");

function createPersonalFilePath (username)
{

    // let filepath = "C:\\mailbox\\upload\\"+username+";
}

async function uploadInChunks(req, res)
{

    const fileName = req.headers["file-name"];
    const chunkId = req.headers["chunk-id"];
    const chunkCount = req.headers["chunk-count"];
    const filePath = process.env.MAIL_DELIVERY_LOCATION+fileName
    try 
    {
        req.on("data", chunk => {
            console.log('PROGRESS: recieved data for chunk',chunkId+"/"+chunkCount+" in",fileName);
            fs.appendFileSync(filePath, chunk);
        });        
        
        req.on("end", () => {
            console.log("Finished receiving chunk", chunkId+" of ", fileName);
            res.status(200).send('Chunk received successfully');
        });

        req.on("error", err => {
            console.error('Error receiving chunk', chunkId, 'of file', fileName, err);
            res.status(500).send('Error receiving chunk');
        });
    }
    catch
    {
        console.error('Error handling file upload for', fileName, error);
        res.status(500).send('Internal Server Error');
    }
}

module.exports = {
    uploadInChunks
};