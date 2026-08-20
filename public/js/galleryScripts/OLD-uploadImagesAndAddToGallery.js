console.log('LOADING image uploading script.. w/ gallery augmentation built in!');

const uploadButton = document.getElementById('upload-button');
const fileInput = document.getElementById('images-input');

const uploadConsole = document.getElementById('upload-console'); //attach DOM elements to this to keep the user informed of their upload progress

let fileNo;
let fileName;

uploadButton.addEventListener("click", async (event) => {
    event.preventDefault();
    // TESTER VV
    // console.log(fileInput.files);

    fileNo = 1;

    let files = fileInput.files;

    let numberOfFiles = files.length;

    let imagesForGallery = [];

    for (const file of files)
    {
        const lastModifiedTimestamp = file.lastModified;

        const lastModifiedDate = new Date(lastModifiedTimestamp);
        // console.log(lastModifiedDate);
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

            //TESTER vv
            // console.log('Result from upload',result);
            imagesForGallery.push(result.image);
        }
        catch (error)
        {
            console.log('Request to upload failed!', error);
        }

        // addUploadStatusToConsoleDOM(true, null);
        fileNo++; //END
    }

    console.log('Preparing to add images to gallery titled',galleryObjectFromDB.title);

    console.log('imagesForGallery',imagesForGallery);


    if (imagesForGallery.length > 0) {
        try {
            const response = await fetch(`/api/image/updateGalleryFromMongoIds/${galleryObjectFromDB.galleryId}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ imageList: imagesForGallery })
            });

            const result = await response.json();

            if (result.success) {
                console.log("Gallery updated successfully!");
                // Optionally, you can update your front-end gallery view here
            } else {
                console.error("Failed to update gallery:", result.errorMsg);
            }
        } catch (error) {
            console.error("Request to update gallery failed:", error);
        }
    } else {
        console.log("No images uploaded, gallery not updated.");
    }

});

// functions to update the client user on how their requests went vvv
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