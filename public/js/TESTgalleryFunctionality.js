//script for enlarging selected image

function closeDisplayOnClickingBackdrop(event) {
    // Only trigger close if the backdrop itself was clicked
    if (event.target.id === "image-display") {
        closeDisplay();
    }
}

function openFullImage(src)
{
    console.log('OPENING!');
    const display = document.getElementById('image-display');
    const image = document.getElementById('image-to-be-displayed');
    image.src = src;
    display.classList.remove("hidden");
}

function closeDisplay() {
    document.getElementById("image-display").classList.add("hidden");
}

//script for fetching list of images from the database

let images;

populateImagesObjectFromDatabase();

async function populateImagesObjectFromDatabase()
{
    images = await fetchImagesByUsername(pageUsername);
    //TESTER vv
    // console.log(images);
}

async function fetchImagesByUsername(username) 
{
    try
    {
        const response = await fetch("/api/image/getImagesByUsername/"+username, {
            method: "GET"
        });

        const data = await response.json();

        //TESTER vv
        // console.log(data);
        return data;

    }
    catch (error)
    {
        console.log('fetchImagesByUsername failed!', error);
    }

}

//script for sending a request to create a gallery

let testGallery;

let selectedImages; //for simplicity, I am ignoring a selection system for now in favor of just creating a gallery with all the images from DB

let galleryCreationForm = document.getElementById('gallery-creation-panel');

galleryCreationForm.addEventListener("submit", async function(e) {
    e.preventDefault();

    formData = new FormData(this);
    const title = formData.get("galleryTitle");

    addGalleryCreationToConsoleDOM(title);

    await populateImagesObjectFromDatabase();

    selectedImages = images; //for simplicity sake, selected images is just all the images the user has uploaded

    let selectedImgIds = selectedImages.map(img => img._id);

    //TESTER vvv
    console.log(selectedImgIds);
    //TESTER vvv
    console.log("Creating gallery from:",selectedImages);

    const response = await fetch(galleryCreationForm.action, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(
            {
                title: title,
                imageIds: selectedImgIds
            }
        )
    });

    const result = await response.json();

    addGalleryCreationStatusToConsoleDOM(result.success, result.errorMsg);

    testGallery = result.gallery;
});


//script to display the gallery at push of a button

let createGalleryDOMButton = document.getElementById('generate-gallery-DOM-button');

createGalleryDOMButton.addEventListener("click", (event) => {
    createGalleryDOMButton.style.display = "none";

    testGallery.days.forEach(day => {
        console.log('');
    })
})

// ^_^ script for uploading files when the BEGIN UPLOAD button is pressed

//much of this code is adapted from simpleUploadLogin.js to handle the client side of file uploading vv

const uploadButton = document.getElementById('upload-button');
const fileInput = document.getElementById('images-input');

const uploadConsole = document.getElementById('upload-console'); //attach DOM elements to this to keep the user informed of their upload progress

let fileNo = 1;
let fileName = "";

uploadButton.addEventListener("click", async (event) => {
    event.preventDefault();
    // TESTER VV
    // console.log(fileInput.files);

    fileNo = 1;

    let files = fileInput.files;

    let numberOfFiles = files.length;

    for (const file of files)
    {
        const lastModifiedTimestamp = file.lastModified;
        //TESTER vv
        const lastModifiedDate = new Date(lastModifiedTimestamp);
        console.log(lastModifiedDate);
        //TESTER ^^

        fileName = file.name;

        console.log('('+fileNo+'/'+numberOfFiles+') Preparing to upload:',fileName);
        addUploadToConsoleDOM(numberOfFiles);
        try
        {
            const formData = new FormData();
            formData.append("uploaded_file", file); //uploaded_file matches the parameter expected by multer in the route definition
            formData.append("lastModified", lastModifiedTimestamp)
            const response = await fetch("/api/image/uploadImageWithMulter", {
                method: "POST",
                body: formData,
            });

            const result = await response.json();
            if (result.success)
            {
                console.log('Successfully uploaded',fileName);
                addUploadStatusToConsoleDOM(result.success, result.errorMsg);
            }
            else
            {
                console.log('Failed to upload',fileName);
                addUploadStatusToConsoleDOM(result.success, result.errorMsg);
            }
        }
        catch (error)
        {
            console.log('Request to upload failed!', error);
        }

        // addUploadStatusToConsoleDOM(true, null);
        fileNo++; //END
    }

});

function addUploadToConsoleDOM(numberOfFiles)
{
    const consoleMessage = document.createElement("div");
    consoleMessage.innerText = '('+fileNo+'/'+numberOfFiles+') Preparing to upload: '+fileName;
    consoleMessage.style.color = "white";
    return uploadConsole.appendChild(consoleMessage);
}

function addUploadStatusToConsoleDOM(success, statusMessage)
{
    if (!statusMessage)
    {   
        statusMessage = "NO MESSAGE";
    }
    const consoleMessage = document.createElement("div");
    consoleMessage.textContent = "Status: "+statusMessage;
    if (!success)
    {
        consoleMessage.style.color = "red";
    }
    else
    {
        consoleMessage.style.color = "white";
    }

    return uploadConsole.appendChild(consoleMessage);
}

function addGalleryCreationToConsoleDOM(title)
{
    const consoleMessage = document.createElement("div");
    consoleMessage.innerText = 'Creating a gallery called '+title;
    consoleMessage.style.color = "white";
    return uploadConsole.appendChild(consoleMessage);
}

function addGalleryCreationStatusToConsoleDOM(success, statusMessage)
{
    if (!statusMessage)
    {   
        statusMessage = "NO MESSAGE";
    }
    const consoleMessage = document.createElement("div");
    consoleMessage.textContent = "Gallery Creation Status: "+statusMessage;
    if (!success)
    {
        consoleMessage.style.color = "red";
    }
    else
    {
        consoleMessage.style.color = "white";
    }
    
    return uploadConsole.appendChild(consoleMessage);
}