//vv the backend route that handles writing the file
//front end (this script) recieves file, sends request to back end, starts an upload connection via xmlhttprequest
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
    const CHUNK_SIZE = 1000; //1000 bytes is almost a kb

    const chunkCount = file.size/CHUNK_SIZE;

    //loop through all chunks based on calculated chunk counts (plus an extra loop for any remainder bytes)
    for (let chunkId = 0; chunkId < chunkCount + 1 /* +1 for remainder bytes */; chunkId++)
    {
        //a chunk is a string of bytes sliced based on chunkId position
        const chunk = file.slice(chunkId*CHUNK_SIZE, chunkId*CHUNK_SIZE+CHUNK_SIZE);
        await uploadFileChunk(file, chunk);
    }
}

//vv sends a file chunk as an upload request to the server
async function uploadFileChunk(file, fileChunk)
{
    const formData = new FormData();
    formData.append('file', file);
    formData.append('chunk', fileChunk);
    
    //create a xmlhttprequest to asynch manage data from active uploads
    const req = new XMLHttpRequest();

    req.open('POST', uploadUrl, true); //true means asynchronous
    // req.setRequestHeader("Content-Length", file.size);

    req.upload.addEventListener('progress', (event) => {
        onProgress(event, file);
    });
    req.addEventListener('error', (event) => {
        onError(event, file);
    });
    req.addEventListener('load', (event) => {
        onComplete(event, file);
    });
    req.addEventListener('abort', (event) => {
        onCanceled(event, file);
    });

    //send the xmlhttprequest to the server
    req.send(formData);
}

function createUploadElements()
{

}

function onProgress(e, file)
{
    console.log(`Upload Progress: uploaded ${e.loaded}/${e.total} of ${file.name}`);
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