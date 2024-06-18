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
        uploadIndividualFile(file);
    }
}

function uploadIndividualFile(file)
{
    const formData = new FormData();
    formData.append('files', file);
    
    //create a xmlhttprequest to asynch manage data from active uploads
    const req = new XMLHttpRequest();

    req.open('POST', uploadUrl, true);
    req.setRequestHeader("Content-Length", file.size);

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
}

function onProgress(e, file)
{
    
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