//script for enlarging selected image

function openFullImage(src)
{
    //TESTER VVV
    // console.log('OPENING!');

    const display = document.getElementById('image-display');
    const image = document.getElementById('image-to-be-displayed');

    currentImageIndex = imageUrlList.indexOf(src); //match image url to the url list to get an index

    image.src = src;
    display.classList.remove("hidden");
}

function closeDisplayOnClickingBackdrop(event) {
    // Only trigger close if the backdrop itself was clicked
    if (event.target.id === "image-display") {
        closeDisplay();
    }
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

let testGallery; //object to contain gallery dates and image references
let galleryObjectFromDB;

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
    gallery = testGallery; //LOL don't ask.... ;_;
});


//script to display the gallery at push of a button

const createGalleryDOMButton = document.getElementById('generate-gallery-DOM-button');
const dayContainerTemplate = document.getElementById('gallery-day-template');
const imageContainerTemplate = document.getElementById('gallery-image-template');
const galleryContainer = document.getElementById('gallery');

let imageUrlList = []; //to store image urls for traversal
let currentImageIndex = -1; //keep track of currently opened image

createGalleryDOMButton.addEventListener("click", (event) => {
    //TESTER vvv
    console.log("Gallery:",gallery);
    createGalleryDOMButton.style.display = "none";

    gallery.days.forEach(day => { //iterate through each day listed in the gallery
        const dayContainer = dayContainerTemplate.content.cloneNode(true);
        
        const dateHeader = dayContainer.querySelector("h1");
        const rawDate = new Date(day.date);
        const formattedDate = rawDate.toLocaleDateString("en-us", {
            year: "numeric",
            month: "long",
            day: "numeric"
        }); //Month Day, Year format, en-US
        dateHeader.innerText = formattedDate;

        const pictureContainer = dayContainer.querySelector(".gallery-picture-container");

        day.images.forEach(img => {
            console.log('hi');
            const pictureDiv = imageContainerTemplate.content.cloneNode(true).querySelector(".gallery-image");

            //TESTER vv
            // console.log("pictureDiv",pictureDiv);
            // console.log("img",img);

            //NOTE: img in this case is just the key for the image's mongoID that I refer to as MID

            let imageUrl = "/api/image/getByMID/"+img;
            pictureDiv.style.backgroundImage = `url(${imageUrl})`;
            // pictureDiv.setAttribute("data-MID", img);

            imageUrlList.push(imageUrl);

            pictureDiv.onclick = () => openFullImage(imageUrl);

            pictureContainer.appendChild(pictureDiv)
        });

        // vv attach finished day to the gallery (with all headers and images attached to it)
        galleryContainer.appendChild(dayContainer);
    })

    //TESTER vvv
    // console.log("imageUrlList",imageUrlList);
})

// :D script for traversing the images with left and right arrow

document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") 
    {

        currentImageIndex = currentImageIndex - 1;
        if (currentImageIndex < 0)
        {
            currentImageIndex = imageUrlList.length - 1;
        }
        //TESTER vv
        // console.log("Index!",currentImageIndex);

        openFullImage(imageUrlList[currentImageIndex]);
    }
    if (event.key === "ArrowRight") 
    {
        currentImageIndex = currentImageIndex + 1;
        if (currentImageIndex > imageUrlList.length - 1)
        {
            currentImageIndex = 0;
        }
        //TESTER vv
        // console.log("Index!",currentImageIndex);

        openFullImage(imageUrlList[currentImageIndex]);
    }
    if (event.key === "Escape") {
        closeDisplay();
    }
});

let imageLeftArrow = document.getElementById('image-display-left-arrow');
let imageRightArrow = document.getElementById('image-display-right-arrow');

imageLeftArrow.onclick = () => {

        currentImageIndex = currentImageIndex - 1;
        if (currentImageIndex < 0)
        {
            currentImageIndex = imageUrlList.length - 1;
        }
        //TESTER vv
        // console.log("Index!",currentImageIndex);

        openFullImage(imageUrlList[currentImageIndex]);   
}

imageRightArrow.onclick = () => {
    currentImageIndex = currentImageIndex + 1;
    if (currentImageIndex > imageUrlList.length - 1)
    {
        currentImageIndex = 0;
    }
    //TESTER vv
    // console.log("Index!",currentImageIndex);

    openFullImage(imageUrlList[currentImageIndex]);
}


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