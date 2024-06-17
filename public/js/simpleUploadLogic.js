const uploadButton = document.getElementById('upload-button');

function uploadFiles(files)
{

}

uploadButton.addEventListener("change", (event) => {
    console.log('--event:', event.target.files);

    uploadFiles(event.target.files);
});