//vv the backend route that handles writing the file
//front end (this script) recieves file, sends request to back end, starts an upload connection via xmlhttprequest
// const localServerUrl = "http://localhost:8080"
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

function uploadFiles(files)
{
    let fileNo = 0;
    for (const file of files)
    {
        file.fileNo = fileNo;
        fileNo++;
        
    }
    for (const file of files)
    {
        console.log('About to upload', file.name);
        createUploadElement(file.fileNo, file.name);
        uploadIndividualFile(file);
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
        const chunkNumber = chunkId+1;
        //a chunk is a string of bytes sliced based on chunkId position
        const chunk = file.slice(chunkId*CHUNK_SIZE, chunkId*CHUNK_SIZE+CHUNK_SIZE);
        await uploadFileChunk(chunk, chunkId, chunkCount, file.name, file.fileNo);
        console.log("% % Chunk "+chunkNumber+" of "+chunkCount+" upload request complete!");
    }
}

//previously used XMLHTTP request... trying it with fetch now. See github for old method
//vv sends a file chunk as an upload request to the server
async function uploadFileChunk(fileChunk, chunkId, chunkCount, fileName, fileNo)
{
    //vv attempt to send chunk to back end, recieve response telling how it went ;p
    const response = await fetch(uploadUrl, {
        method: "POST",
        headers: {
            "content-type": "application/octet-stream",
            "content-length": fileChunk.length,
            "file-name": fileName,
            "chunk-id": chunkId,
            "chunk-count": chunkCount
        },
        body: fileChunk
    });

    updateUploadElement(fileNo, chunkId, chunkCount, response);

}

function updateUploadElement(fileNo, chunkId, chunkCount, response)
{
    //the span vv that contains %
    const uploadPercent = document.getElementById('filePercentage-'+fileNo+'');

    //the span vv that contains status message
    const uploadStatus = document.getElementById('fileStatus-'+fileNo+'');

    let uploadInfo = response.json();
    console.log(uploadInfo);

    const percent = Math.round((chunkId+1) *100 / chunkCount);

    if (response.status == 200 && uploadInfo.uploadComplete) //chunk recieved success
    {

        uploadPercent.textContent = "100%";
        uploadStatus.textContent = uploadInfo.message;
    }
    else if (response.status == 200) //whole file (supposedly) complete
    {
        uploadPercent.textContent = percent+"%";
        uploadStatus.textContent = uploadInfo.message;
    }
    else 
    {
        uploadPercent.textContent = percent+"%";
        uploadStatus.textContent = "FAILED";
    }
}

function createUploadElement(fileNo, fileName)
{
    const uploadDiv = document.createElement("div");
    uploadDiv.id = "file-"+fileNo;
    uploadDiv.className = "individual-upload";
    uploadDiv.innerHTML = `<span id="fileName-${fileNo}">${fileName}
    <hr>
    <div class="text-align-left">
    <span class="smaller-upload-text">&nbsp;Status:</span> <span id="fileStatus-${fileNo}">Uploading</span>
    <br>
    <span class="smaller-upload-text">&nbsp;Progress:</span> <span id="filePercentage-${fileNo}">0%</span>
    </div>`;
    uploadContainer.appendChild(uploadDiv);
}

//vv old XMLHTTP request info vv
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