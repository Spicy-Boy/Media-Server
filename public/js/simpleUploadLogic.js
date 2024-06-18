const uploadButton = document.getElementById('upload-button');

const uploadUrl = "/api/suicune/simpleUpload";

function uploadFiles(files)
{
    const formData = new FormData();

    for (const file of files)
    {
        formData.append('files', file);
    }

    //create a xmlhttprequest to asynch gather data from active uploads
    const req = new XMLHttpRequest();

    req.open('POST', uploadUrl, true);
    req.setRequestHeader("Content-Length", file.size);
}

function uploadIndividualFile(file)
{
    
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

uploadButton.addEventListener("change", (event) => {
    console.log('--event:', event.target.files);

    uploadFiles(event.target.files);
});