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

function uploadIndividualFile(file)
{
    const formData = new FormData();
    formData.append('file', file);
    
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
    console.log('PROGRESS EVENT!',file);
}
function onError(e, file)
{

}
function onComplete(e, file)
{
    
}
function onCanceled(e, file)
{
    
}