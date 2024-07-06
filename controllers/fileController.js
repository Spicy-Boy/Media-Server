const fs = require("fs");
const User = require("../models/userModel");

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
          console.log("New user directory for "+username+" created successfully!");
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
        console.error('Error handling file upload for',fileName,error);
        res.status(500).send('Internal Server Error');
    }
}

async function createPersonalDatabaseEntry(req, res)
{
    try
    {
        const fileName = req.headers["file-name"];
        const fileSize = req.headers["file-size"];

        console.log('Creating database entry for',fileName);

        const username = req.session.activeUser.username;

        const targetUser = await User.findOne({username: username});

        let newEntry = {
            name: fileName,
            size: fileSize,
            location: process.env.MAIL_DELIVERY_LOCATION+"/"+username+"_files/"+fileName //file location is saved just in case the .env mail delivery location changes. This keeps a record of where the file was uploaded originally to aid in future recovery efforts
        }

        targetUser.files.push(newEntry);
        await targetUser.save();

        res.status(200).send("SUCCESS! Created a database entry");
    }
    catch(error)
    {
        console.error('Error handling database entry creation..',error);
        res.status(500).send('Internal Server Error');
    }
}

module.exports = {
    uploadInChunks,
    createPersonalDatabaseEntry
};