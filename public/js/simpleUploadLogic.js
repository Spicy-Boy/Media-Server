//vv the backend route that handles writing the file
//front end (this script) recieves file, sends request to back end, starts an upload connection via xmlhttprequest
// const localServerUrl = "http://localhost:8080"
const uploadUrl = "/api/suicune/simpleUpload";

const uploadButton = document.getElementById('upload-button');

uploadButton.addEventListener("change", (event) => {
    console.log('--event:', event.target.files);

    uploadFiles(event.target.files);
});

function uploadFiles(files)
{
    for (const file of files)
    {
        console.log('About to upload', file.name);
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


    const chunkCount = Math.ceil(file.size/CHUNK_SIZE);

    console.log('Initialized upload of '+file.name+' -- # of chunks = '+String(chunkCount-1)+', file.size/CHUNK_SIZE = '+file.size/CHUNK_SIZE);
    //loop through all chunks based on calculated chunk counts (plus an extra loop for any remainder bytes)
    for (let chunkId = 0; chunkId < chunkCount; chunkId++)
    {
        //a chunk is a string of bytes sliced based on chunkId position
        const chunk = file.slice(chunkId*CHUNK_SIZE, chunkId*CHUNK_SIZE+CHUNK_SIZE);
        await uploadFileChunk(chunk, chunkId, file.name);
        console.log("% % Chunk "+chunkId+" of "+chunkCount+" upload request complete!");
    }
}

//previously used XMLHTTP request... trying it with fetch now. See github for old method
//vv sends a file chunk as an upload request to the server
async function uploadFileChunk(fileChunk, chunkId, fileName)
{

    const response = await fetch(uploadUrl, {
        method: "POST",
        headers: {
            "content-type": "application/octet-stream",
            "content-length": fileChunk.length,
            "file-name": fileName,
            "chunk-id": chunkId
        },
        body: fileChunk
    });

    // if (!response.ok)
    // {
    //     console.log("Something went wrong with chunk upload!");
    // }
    // else
    // {
    //     console.log("Chunk upload response: ",response);
    // }

}

function createUploadElements()
{

}

function onProgress(e, file)
{
    console.log(`Uploaded Chunk ${e.loaded}/${e.total} of ${file.name}`);
    // console.log('PROGRESS EVENT!',file);

}
function onError(e, file)
{
    console.log(`!!! - UPLOAD ERROR: ${file.name}`);
}
function onComplete(e, file)
{
    console.log(`UPLOAD COMPLETE: ${file.name}`);
}
function onCanceled(e, file)
{
    console.log(`!!! - UPLOAD CANCELED: ${file.name}`);
}