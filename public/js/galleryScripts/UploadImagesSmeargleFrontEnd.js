console.log('HELLO! LOADING uploadImagesSmeargleFrontEnd SCRIPT!');

const uploadButton = document.getElementById('upload-button');
const fileInput = document.getElementById('images-input');

let fileNo;
let fileName;

let listOfImageUUIDs = [];

uploadButton.addEventListener("click", async (event) => {
    event.preventDefault();
    // TESTER VV
    // console.log(fileInput.files);

    fileNo = 1;

    let files = fileInput.files;

    let numberOfFiles = files.length;
    //vv method from updateConsoleWindow.js
    if (numberOfFiles > 1)
    {
        addMessageToConsole("> Uploading "+numberOfFiles+" files to the server!");
    }
    else
    {
        addMessageToConsole("> Uploading "+numberOfFiles+" file to the server!");
    }

    let imagesForGallery = [];

    for (const file of files)
    {
        const fileCreationDate = new Date(file.lastModified);
        //TESTERS vvv
        // console.log(file.lastModified);
        // console.log(fileCreationDate);

        const fileName = file.name;

        console.log('('+fileNo+'/'+numberOfFiles+') Preparing to upload:',fileName);
        addMessageToConsole("> Preparing to upload: "+fileName+". ("+fileNo+"/"+numberOfFiles+")")

        try
        {
            const formData = new FormData();

            formData.append("uploaded_file", file); //uploaded_file matches the parameter expected by multer in the route definition

            formData.append("lastModified", fileCreationDate);
            // formData.append("originalName", fileName);

            // check createImageDatabaseEntry in back end image controller!!!

            const response = await fetch("/api/image/uploadImageWithMulter", {
                method: "POST",
                body: formData,
            });

            //TESTER vv
            // console.log("HTTP status:", response.status);
            // console.log("HTTP OK:", response.ok);
            // console.log("Content-Type:", response.headers.get("content-type")); 

            const result = await response.json();
            if (result.success)
            {
                console.log('('+fileNo+'/'+numberOfFiles+') Successfully uploaded',fileName);

                addMessageToConsole("> SERVER: "+result.message);

                //NOTE: update this when you add video compatibility!!!!
                listOfImageUUIDs.push(result.image.imgId);
            }
            else
            {
                console.log('Failed to upload',fileName);

                addMessageToConsole("> ERROR: "+fileName+" failed to upload! ("+fileNo+"/"+numberOfFiles+")");

                addMessageToConsole("> SERVER: "+result.message);

            }
        }
        catch (error)
        {
            console.log('Request to upload '+fileName+' failed!', error);
            addMessageToConsole("> ERROR: "+fileName+" failed to upload! ("+fileNo+"/"+numberOfFiles+")");
        }
        fileNo++; //END
    }

    if (autoGenerateThumbnails)
    {
        listOfImageUUIDs.forEach(uuid => {
            console.log('image: ', uuid);
        });
    }
});

//     console.log('Preparing to add images to gallery titled',galleryObjectFromDB.title);

//     console.log('imagesForGallery',imagesForGallery);


//     if (imagesForGallery.length > 0) {
//         try {
//             const response = await fetch(`/api/image/updateGalleryFromMongoIds/${galleryObjectFromDB.galleryId}`, {
//                 method: "POST",
//                 headers: {
//                     "Content-Type": "application/json"
//                 },
//                 body: JSON.stringify({ imageList: imagesForGallery })
//             });

//             const result = await response.json();

//             if (result.success) {
//                 console.log("Gallery updated successfully!");
//                 // Optionally, you can update your front-end gallery view here
//             } else {
//                 console.error("Failed to update gallery:", result.errorMsg);
//             }
//         } catch (error) {
//             console.error("Request to update gallery failed:", error);
//         }
//     } else {
//         console.log("No images uploaded, gallery not updated.");
//     }

// });