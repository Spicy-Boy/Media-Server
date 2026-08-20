const { createImageDatabaseEntry } = require("../../../controllers/imageController");

console.log('HELLO! LOADING uploadImagesSmeargleFrontEnd SCRIPT!');

const uploadButton = document.getElementById('upload-button');
const fileInput = document.getElementById('images-input');

let fileNo;
let fileName;

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
        addMessageToConsole("> Smeargle: copying "+numberOfFiles+" files to the server!");
    }
    else
    {
        addMessageToConsole("> Smeargle: copying "+numberOfFiles+" file to the server!");
    }


    let imagesForGallery = [];

    for (const file of files)
    {
        const fileCreationDate = file.lastModified;
        // console.log(lastModifiedDate);
        // TESTER ^^

        fileName = file.name;

        console.log('('+fileNo+'/'+numberOfFiles+') Preparing to upload:',fileName);

        try
        {
            const formData = new FormData();

            formData.append("uploaded_file", file); //uploaded_file matches the parameter expected by multer in the route definition

            formData.append("lastModified", fileCreationDate);


            check createImageDatabaseEntry in back end image controller!!!

            const response = await fetch("/api/image/uploadImageWithMulter", {
                method: "POST",
                body: formData,
            });

            const result = await response.json();
            if (result.success)
            {
                console.log('('+fileNo+'/'+numberOfFiles+') Successfully uploaded',fileName);
    
            }
            else
            {
                console.log('Failed to upload',fileName);

                addMessageToConsole("> Smeargle: "+fileName+" failed to upload! ("+fileNo+"/"+numberOfFiles+")");

            }

        }
        catch (error)
        {
            console.log('Request to upload '+fileName+' failed!', error);
            addMessageToConsole("> Smeargle: "+fileName+" failed to upload! ("+fileNo+"/"+numberOfFiles+")");
        }
        fileNo++; //END
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