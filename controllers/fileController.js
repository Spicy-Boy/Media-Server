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
    const username = req.session.activeUser.username;

    //user files are saved in a directory based on session username
    let filePath = process.env.MAIL_DELIVERY_LOCATION+"/"+username+"_files";

    // create local directory for user if it hasn't already been created
    if (!fs.existsSync(filePath)) {
        fs.mkdir(filePath, (err) => {
          if (err) {
            return console.error(err);
          }
          console.log("New user directory for "+req.session.username+" created successfully!");
        });
      }

    filePath = process.env.MAIL_DELIVERY_LOCATION+"/"+username+"_files/"+fileName
    try 
    {
        req.on("data", chunk => {
            console.log('PROGRESS: recieved data for chunk',(Number(chunkId)+1)+"/"+chunkCount+" in",fileName);
            fs.appendFileSync(filePath, chunk);
        });        
        
        req.on("end", () => {
            console.log("Finished receiving chunk", chunkId+" of", fileName);
            // console.log((chunkId+1)+'/'+chunkCount);
            if (Number(chunkId)+1 == chunkCount)
            {
                console.log("Upload of "+fileName+" complete");
                res.status(200).json({
                    message: 'Processing',
                    uploadComplete: true
                });
            }
            else {
                res.status(200).json({
                    message: 'Uploading',
                    uploadComplete: false
                });
            }
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