const fs = require("fs");
const User = require("../models/userModel");

function createPersonalFilePath (username)
{

    // let filepath = "C:\\mailbox\\upload\\"+username+";
}

//asynchronous file writing method that has some retry potential
//gpt showed me how to make a promise ;p
async function writeFileWithRetry(filePath, chunk, retries, retryDelay)
{
    return new Promise((resolve, reject) => {
        const tryWrite = (retries) => {
            try
            {
                fs.appendFileSync(filePath, chunk);
                resolve();
            } 
            catch (error)
            {
                if (error.code === 'EBUSY' && retries > 0)
                {
                    console.error("File upload felt busy; retrying in "+retryDelay+" ms..",error);
                    retries--;
                    setTimeout(()=>{tryWrite(retries - 1)}, retryDelay);
                }
                else
                {
                    reject(error);
                }
            }
        }

        tryWrite(retries);
    });
}

async function uploadInChunks(req, res)
{

    const fileName = req.headers["file-name"];
    const chunkId = req.headers["chunk-id"];
    const chunkCount = req.headers["chunk-count"];
    const username = req.session.activeUser.username;


    //to combat errors, we give a chunk 10 chances to upload successfully before failing it
    let retrying = true;
    let retries = 10;
    const retryDelay = 1000;

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

    // tester vv
    // if (fs.existsSync(filePath))
    // {
    //     console.log('FILE EXISTS ALREADY IN MAILBOX');
    // }

    // DELETE vv the file if it already exists. Overwrites! This prevents issues with appending data to existing file.
    if (fs.existsSync(filePath) && chunkId == 0)
    {
        console.log('File name '+fileName+' already exists in mailbox, deleting...');
        fs.unlink(filePath, (error) => {
            if (error)
            {
                console.error("File deletion from disc failed! Not saving changes to database.",error);
                return res.status(500).send(`Internal overwrite failure 1. CALL ADMIN!`);
            }
            else
            {
                console.log('Successfully removed '+fileName+" from disc as part of overwrite!");
            }
        });

        //DELETE FILE ON DB TOO so it doesn't create 2 db entries with same file name
        try 
        {
            const dbUser = await User.findOne({username: req.session.activeUser.username});

            //searches for file in user's db entry by its file name.. maybe not the best ;p
            targetFile = dbUser.files.find( file => file.name === fileName);
            console.log(targetFile);

            if (targetFile)
            {
                const indexToDelete = dbUser.files.indexOf(targetFile);
                dbUser.files.splice(indexToDelete, 1);

                console.log("Deleting "+targetFile.name+" from "+dbUser.username+"'s db file list!");

                await dbUser.save();
            }
        }
        catch (error)
        {
            console.log('Error occured while attempting to delete DB entry for preexisting file name...',error);
            return res.status(500).send(`Internal overwrite failure 2. CALL ADMIN!`);
        }

    }

    try 
    {
        req.on("data", async (chunk) => {
            console.log('PROGRESS: recieved data for chunk',(Number(chunkId)+1)+"/"+chunkCount+" in",fileName);
            
            try
            {
                await writeFileWithRetry(filePath, chunk, retries, retryDelay);
            }
            catch (error)
            {
                console.error('Failed to write chunk',(Number(chunkId)+1)+"/"+chunkCount+" of",fileName, error);
                res.status(500).send("Chunk upload got too busy, aborting!");
            }
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
    catch (error)
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

async function downloadFile(req, res)
{
    //contruct the path based on the request parameters
    const targetUsername = req.params.username;
    const fileId = req.params.fileId;

    try {
        const targetUser = await User.findOne({username: targetUsername});

        targetFile = targetUser.files.find( file => file.fileId === fileId);

        if (!targetFile) {
            return res.status(404).send('File not found.');
        }

        let fileLocation = process.env.MAIL_DELIVERY_LOCATION+"/"+targetUsername+"_files/"+targetFile.name;

        res.download(fileLocation, targetFile.name, (error) => {
            if (error)
            {
                console.error('Error downloading file..', error);
                if (!res.headersSent) {
                    res.status(500).send('An error occurred while downloading the requested file... does it still exist? Contact admin for support.');
                }
            }
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).send("An error occured while trying to find the file for download..");
    }
}

//send the file portion of a user's db entry to requester
async function sendSingleUsersFileList(req, res)
{
    const targetUsername = req.params.username;
    try 
    {
        const targetUser = await User.findOne({username: targetUsername});

        if (!targetUser)
        {
            return res.sendStatus(404).send("No such user found..");
        }

        return res.status(200).send(targetUser.files);
    }
    catch (error) {
        console.error(error);
        res.status(500).send("An error occured while trying to find the target user's files... contact admin for support!");
    }
}

// vv sends a single file, usually an image for display through img src request
async function sendFile(req, res)
{
    // console.log('sendFile called');
    //contruct the path based on the request parameters
    const targetUsername = req.params.username;
    const fileId = req.params.fileId;

    try {
        const targetUser = await User.findOne({username: targetUsername});

        targetFile = targetUser.files.find( file => file.fileId === fileId);

        if (!targetFile) {
            return res.status(404).send('File not found.');
        }

        let fileLocation = process.env.MAIL_DELIVERY_LOCATION+"/"+targetUsername+"_files/"+targetFile.name;

        res.sendFile(fileLocation, (error) => {            
            if (error)
            {
                console.error('Error sending file..', error);
                if (!res.headersSent) {
                    res.status(500).send('An error occurred while sending the requested file... does it still exist? Contact admin for support.');
                }
            }
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).send("An error occured while trying to find the file for display..");
    }
}

//checks if the file id set in req parameter exists in active user's files. If so, pop it out! Permanently deletes the file data from the database
async function deleteFile(req, res)
{
    try 
    {
        const fileId = req.params.fileId;

        const dbUser = await User.findOne({username: req.session.activeUser.username});
        
        targetFile = dbUser.files.find( file => file.fileId === fileId);

        if (targetFile)
        {
            const indexToDelete = dbUser.files.indexOf(targetFile);
            dbUser.files.splice(indexToDelete, 1);

            console.log("Deleting "+targetFile.name+" from "+dbUser.username+"'s file list...");
            //literally vv deletes the file from disc
            fs.unlink(targetFile.location, (error) => {
                if (error)
                {
                    console.error("File deletion from disc failed! Not saving changes to database.",error);
                    return res.send(`<center><h1 style="color: yellow">Deletion failed... please try again later!</h1></center>`);
                }
            });

            await dbUser.save();
            res.redirect("/u");
        }
        else 
        {
            res.send(`<center><h1 style="color: red">YOU DO NOT HAVE PERMISSION TO DO THAT</h1></center>`)
        }
    }
    catch (error)
    {
        console.error(error);
        res.status(500).send("Something went wrong during deletion");
    }

}

//checks if the file id set in req parameter exists in active user's files. Is so, change the isPublic variable to the opposite of its current value
async function toggleVisibility(req, res)
{
    try 
    {
        const fileId = req.params.fileId;

        const dbUser = await User.findOne({username: req.session.activeUser.username});
        
        targetFile = dbUser.files.find( file => file.fileId === fileId);

        if (targetFile)
        {
            if (targetFile.isPublic)
            {
                targetFile.isPublic = false;
            }
            else
            {
                targetFile.isPublic = true;
            }

            console.log("Setting the isPublic value of "+targetFile.name+" to "+targetFile.isPublic+"...");
            await dbUser.save();
            res.redirect(`/u/${dbUser.username}/${targetFile.fileId}`)
        }
        else 
        {
            res.send(`<center><h1 style="color: red">YOU DO NOT HAVE PERMISSION TO DO THAT</h1></center>`)
        }
    }
    catch(error)
    {
        console.error(error);
        res.status(500).send("Something went wrong during visibility toggle..");
    }
}

module.exports = {
    uploadInChunks,
    createPersonalDatabaseEntry,
    downloadFile,
    deleteFile,
    toggleVisibility,
    sendFile,
    sendSingleUsersFileList
};