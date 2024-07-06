//vv the backend route that handles writing the file
//front end (this script) recieves file, sends request to back end, starts an upload connection via xmlhttprequest
// const localServerUrl = "http://localhost:8080"
let fileNo = 0;

const fileTrackerArray = [];

const uploadUrl = "/api/file/upload";

const uploadButton = document.getElementById('upload-button');
const fileInput = document.getElementById('file');

// vv new divs to contain upload info (like progress bar and status) are
const uploadContainer = document.getElementById('active-uploads');

uploadButton.addEventListener("click", (event) => {
    event.preventDefault();
    // console.log(fileInput.files);
    uploadFiles(fileInput.files);
});

async function uploadFiles(files)
{
    for (const file of files)
    {
        file.fileNo = fileNo;
        fileTrackerArray[fileNo] = {
            fileName: file.name,
            fileSize: file.size,
            isCanceled: false
        }
        createUploadElement(file.fileNo, file.name, file.size);
        fileNo++;
        
    }
    for (const file of files)
    {
        console.log('About to upload', file.name);
        await uploadIndividualFile(file);
    }
}

//CHUNK CONCEPT SOURCE: https://www.youtube.com/watch?v=Ix-c2X7dlks
//vv divides recieved file into chunks, sends chunks as individual requests
async function uploadIndividualFile(file)
{
    let CHUNK_SIZE = 0;
    //1 gb = 1073741824 bytes
    if (file.size < 1073741824)
    {
        CHUNK_SIZE = 107374182.4; // 0.10 gb in bytes
    }
    else
    {
        CHUNK_SIZE = 268435456; // 0.25 gb in bytes
    }

    //vv TESTING bigger chunk sizes
    // let CHUNK_SIZE = 1073741824; //1gb = 1073741824 bytes

    const chunkCount = Math.ceil(file.size/CHUNK_SIZE);

    // console.log(Initialized upload of '+file.name+' -- '+chunkCount+" chunks, "file.size/CHUNK_SIZE = '+file.size/CHUNK_SIZE);
    console.log(`Initialized upload of ${file.name} -- chunks: ${chunkCount}, file.size/CHUNK_SIZE: ${file.size/CHUNK_SIZE}, CHUNK_SIZE: ${CHUNK_SIZE} bytes`);
    //loop through all chunks based on calculated chunk counts (plus an extra loop for any remainder bytes)
    for (let chunkId = 0; chunkId < chunkCount; chunkId++)
    {
        //OLD cancelation method vv
    // if (fileTrackerArray[file.fileNo].isCanceled)
    // {
    //     console.log('CANCEL DETECTED');
    //     updateUploadElement(file.fileNo, chunkId, chunkCount, {message: "CANCELED", uploadComplete: false}, 500);
    //     // INSERT METHOD HERE FOR CANCELING/DELETING FILE ON BACK END!
    //     return;
    // }

        const chunkNumber = chunkId+1;
        //a chunk is a string of bytes sliced based on chunkId position
        const chunk = file.slice(chunkId*CHUNK_SIZE, chunkId*CHUNK_SIZE+CHUNK_SIZE);
        try 
        {
            await uploadFileChunk(chunk, chunkId, chunkCount, file.name, file.fileNo);
        }
        catch (error)
        {
            console.error(error);
            
            if (error.name === 'AbortError')
            {
                updateUploadElement(file.fileNo, chunkId, chunkCount, {message: "CANCELED", uploadComplete: false}, 500);
                // INSERT METHOD HERE FOR CANCELING/DELETING FILE ON BACK END!
            }
            else 
            {
                updateUploadElement(file.fileNo, chunkId, chunkCount, {message: "FAILED", uploadComplete: false}, 500);
                // INSERT METHOD HERE FOR CANCELING/DELETING FILE ON BACK END!
            }
            return;
        }

        console.log("% % Chunk "+chunkNumber+" of "+chunkCount+" upload request complete!");
    }

    
}

//previously used XMLHTTP request... trying it with fetch now. See github for old method
//vv sends a file chunk as an upload request to the server
async function uploadFileChunk(fileChunk, chunkId, chunkCount, fileName, fileNo)
{
    //vv attempt to send chunk to back end, recieve response telling how it went ;p
    const controller = new AbortController();
    const signal = controller.signal;

    const cancelButton = document.getElementById("cancel"+fileNo);
    cancelButton.addEventListener("click", function () {
        // console.log(this);
        // vv extract the fileNo from the id of the cancel button
        const fileNumber = this.id.substring("cancel".length);

        fileTrackerArray[Number(fileNumber)].isCanceled = true;

        controller.abort();
    });

    const response = await fetch(uploadUrl, {
        method: "POST",
        headers: {
            "content-type": "application/octet-stream",
            "content-length": fileChunk.length,
            "file-name": fileName,
            "chunk-id": chunkId,
            "chunk-count": chunkCount
        },
        body: fileChunk,
        signal: signal
    });

    //convert the response to json to extract res status message and completeness boolean
    let uploadInfo = await response.json();

    updateUploadElement(fileNo, chunkId, chunkCount, uploadInfo, response.status);
}

function updateUploadElement(fileNo, chunkId, chunkCount, uploadInfo, status)
{
    //the span vv that contains %
    const uploadPercent = document.getElementById('filePercentage-'+fileNo+'');

    //the span vv that contains status message
    const uploadStatus = document.getElementById('fileStatus-'+fileNo+'');

    const percent = Math.ceil((chunkId+1) / chunkCount * 100);

    if (status == 200 && uploadInfo.uploadComplete) //chunk recieved success
    {
        uploadPercent.textContent = "100%";
        uploadStatus.textContent = uploadInfo.message;
    }
    else if (status == 200) //whole file (supposedly) complete
    {
        uploadPercent.textContent = percent+"%";
        uploadStatus.textContent = uploadInfo.message;
    }
    else 
    {
        uploadPercent.textContent = "XX%";
        uploadStatus.textContent = uploadInfo.message || "FAILED";
        // INSERT METHOD HERE FOR CANCELING/DELETING FILE ON BACK END!
    }
}

function createUploadElement(fileNo, fileName, fileSize)
{
    const uploadDiv = document.createElement("div");
    uploadDiv.id = "file-"+fileNo;
    uploadDiv.className = "individual-upload";
    uploadDiv.innerHTML = `<span id="fileName-${fileNo}">${fileName}
    <hr>
    <div class="text-align-left">
    <span class="smaller-upload-text">&nbsp;Size:</span> <span id="fileSize-${fileNo}">${calculateFileSize(fileSize)}</span>
    <br>
    <span class="smaller-upload-text">&nbsp;Status:</span> <span id="fileStatus-${fileNo}">Waiting..</span>
    <br>
    <span class="smaller-upload-text">&nbsp;Progress:</span> <span id="filePercentage-${fileNo}">0%</span>
    </div>`;
    uploadContainer.appendChild(uploadDiv);
    
    const additionalDetailsDiv = document.createElement("div");
    additionalDetailsDiv.className = "text-align-left";
    additionalDetailsDiv.innerHTML = "&nbsp;"
    additionalDetailsDiv.style.marginTop = "4px";
    uploadDiv.appendChild(additionalDetailsDiv);

    const cancelButton = document.createElement("button");
    cancelButton.id = "cancel"+fileNo;
    cancelButton.textContent = "Cancel";
    additionalDetailsDiv.appendChild(cancelButton);

    // cancelButton.addEventListener("click", function () {
    //     // console.log(this);
    //     // vv extract the fileNo from the id of the cancel button
    //     const fileNumber = this.id.substring("cancel".length);

    //     fileTrackerArray[Number(fileNumber)].isCanceled = true;
    // });
}

//vv old XMLHTTP request event function vv
// function onProgress(e, file)
// {
//     console.log(`Uploaded Chunk ${e.loaded}/${e.total} of ${file.name}`);
//     // console.log('PROGRESS EVENT!',file);

// }
// function onError(e, file)
// {
//     console.log(`!!! - UPLOAD ERROR: ${file.name}`);
// }
// function onComplete(e, file)
// {
//     console.log(`UPLOAD COMPLETE: ${file.name}`);
// }
// function onCanceled(e, file)
// {
//     console.log(`!!! - UPLOAD CANCELED: ${file.name}`);
// }