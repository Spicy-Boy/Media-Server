//vvv ONLY NEED TO BE SET UP ONCE per page load
const editFilesButton = document.getElementById('edit-uploads'); //clicked to enable all editting functionality
const editToolbar = document.getElementById('edit-toolbar'); //a hidden bar containing options like Select All, Delete Selected, and Toggle Visibility (enabled when the editFilesButton above is clicked)
const quickEditDiv = document.getElementById('quick-edit-div');
const selectAllButton = document.getElementById('select-all-uploads');
const deletionWarningDiv = document.getElementById('deletion-warning-div');
const fileDeletionListDiv = document.getElementById('file-deletion-list-div');
const trueDeleteButton = document.getElementById('true-delete-button');
const cancelDeleteButton = document.getElementById('cancel-delete-button');
cancelDeleteButton.addEventListener("click", () => {
    deletionWarningDiv.style.display = "none";
});
// ^^ set up once per page load

/* vv STATES initial vv */
let editVisible = false; //if true, show editing functionality
let isSelectAllToggled = false;
let selectedFiles = [];
let selectedFilesToDelete = []; //important to keep this apart from selection list
let specificFile;
let allEditCheckboxes;
let allEditButtons
/* ^^ STATES initial ^^ */

//NEW vv delegated listener for checkboxes vv
document.addEventListener("change", (e) => {
    if (e.target.classList.contains("checkbox-file-user-portal"))
    {
        const box = e.target;
        if (box.checked)
        {

            selectedFiles.push({
                fileId: box.dataset.fileid,
                name: box.dataset.filename
            });
            
            //TESTER vv
            console.log('Selected',box.dataset.filename);
            console.log('New Selected List:',selectedFiles);
        }
        else
        {
            selectedFiles = selectedFiles.filter(file => file.fileId !== box.dataset.fileid);
            // ^^ clever little function to filter out the deselected file from the list
        }
    }
});

//delegated listener for pencil/edit buttons
document.addEventListener("click", async (e) => {
    if (e.target.classList.contains("edit-file-button-user-portal")) {
        const fileId = e.target.dataset.fileid;
        if (!files) { //files and associated function is set in the header of the userPortal.ejs file
            files = await getUserFilesFromDB(pageUsername);
        }
        specificFile = files.find(f => f.fileId == fileId);

        quickEditDiv.style.display = "flex";
        document.getElementById('quick-edit-filename').textContent = specificFile.name;
        document.getElementById('quick-edit-filesize').textContent = calculateFileSize(Number(specificFile.size));
    }
});

//ensures all boxes vv are unchecked when page loads [ ]
document.addEventListener("DOMContentLoaded", () => {
    const allEditCheckboxes = document.querySelectorAll(".checkbox-file-user-portal");
    allEditCheckboxes.forEach(box => box.checked = false);
});

function setupEditFunctionality()
{
    editVisible = false;

    /* vv STATES vv */ //reset every page load or refresh
    editVisible = false; //if true, show editing functionality
    isSelectAllToggled = false;
    selectedFiles = [];
    selectedFilesToDelete = []; //important to keep this apart from selection list
    specificFile = null;
    allEditCheckboxes = document.querySelectorAll(".checkbox-file-user-portal");
    allEditButtons = document.querySelectorAll(".edit-file-button-user-portal");
    /* ^^ STATES ^^ */

    //RESET DOM elements
    editToolbar.style.display = "none"; 
    selectAllButton.textContent = "Select All";

    editFilesButton.removeEventListener("click", setupEditButtonSpecifically);
    editFilesButton.addEventListener("click", setupEditButtonSpecifically);
}

function setupEditButtonSpecifically()
{
    // Grab fresh references to these DOM elements every time, as they will reset with refreshes
    allEditCheckboxes = document.querySelectorAll(".checkbox-file-user-portal");
    allEditButtons = document.querySelectorAll(".edit-file-button-user-portal");

    if (!editVisible) 
    {
        editToolbar.style.display = "flex";
        editVisible = true;

        allEditButtons.forEach( button => { 
            button.style.display = "inline-block"; //make them visible
        });

        allEditCheckboxes.forEach( box => {
            box.style.display = "inline-block";
        });
    }
    else
    {
        editVisible = false;
        editToolbar.style.display = "none";

        selectAllButton.textContent = "Select All";
        isSelectAllToggled = false;

        selectedFiles = []; //reset selected files list
        selectedFilesToDelete = [];

        allEditButtons.forEach( button => {
            button.style.display = "none"; //turn them invisible
        });

        allEditCheckboxes.forEach( box => {
            //TESTER
            // console.log(box);
            box.checked = false;
            box.style.display = "none";
        });
    }
}

selectAllButton.addEventListener("click", () => {
    if (!isSelectAllToggled)
    {
        selectAllButton.textContent = "Deselect All";

        selectedFiles = [];

        allEditCheckboxes.forEach(box => {
            box.checked = true;

            selectedFiles.push({ //selected files marked by file name and id, can be matched with the "files" list to perform actions on files
                fileId: box.dataset.fileid,
                name: box.dataset.filename
            });
        });

        isSelectAllToggled = true;
    }
    else
    {
        selectAllButton.textContent = "Select All";

        selectedFiles = [];

        allEditCheckboxes.forEach(box => {
            box.checked = false;
        });

        isSelectAllToggled = false;
    }
});

const quickEditCloseButton = document.getElementById('button-close-quick-edit');
quickEditCloseButton.addEventListener("click", () => {
    quickEditDiv.style.display = "none";
});

//DOM elements to change every time the quick edit menu is open!
const quickEditFileName = document.getElementById('quick-edit-filename');
const quickEditFileSize = document.getElementById('quick-edit-filesize');
const quickEditToggleVisibility = document.getElementById('quick-edit-toggle-visibility');
const quickEditToggleVisibilityMessage = document.getElementById('quick-edit-toggle-visibility-message')
const quickEditDeleteButton = document.getElementById('quick-edit-delete');
const quickEditCommentForm = document.getElementById('quick-edit-comment-form');

const toggleVisibilitySelectedButton = document.getElementById('toggle-visibility-selected-uploads');
toggleVisibilitySelectedButton.addEventListener("click", async () => {

    if (selectedFiles.length > 0)
    {
        for (const file of selectedFiles)
        {

            const desktopEyeball = document.getElementById('desktop-eyeball-'+file.fileId);
            const mobileEyeball = document.getElementById('mobile-eyeball-'+file.fileId);

            const response = await fetch("/api/file/toggleVisibility/"+file.fileId, {
                method: "POST",
            })
            .then(res => res.json())
            .then(data => {
                if (data.isPublic)
                {
                    mobileEyeball.style.display = "inline";
                    mobileEyeball.innerText = "👁️";

                    desktopEyeball.style.display = "inline";
                    desktopEyeball.innerText = "👁️";
                }
                else
                {
                    mobileEyeball.style.display = "none";
                    desktopEyeball.style.display = "none";
                }
            });
        }
    }
});

const commentSubmissionButton = document.getElementById('quick-edit-comment-submission');
const commentSubmissionStatus = document.getElementById('quick-edit-comment-status');

deleteSelectedButton = document.getElementById('delete-selected-uploads');
deleteSelectedButton.addEventListener("click", () => {

    selectedFilesToDelete = [...selectedFiles];   // spread
    selectedFilesToDelete = selectedFiles.slice(); // slice
    selectedFilesToDelete = Array.from(selectedFiles);

    if (selectedFilesToDelete.length > 0)
    {
        deletionWarningDiv.style.display = "inline";

        fileDeletionListDiv.textContent = "";
        selectedFilesToDelete.forEach(file => {
            fileDeletionListDiv.innerHTML += file.name+"<br>";
        });
    }
});

async function deleteSelectedFiles()
{
    if (selectedFilesToDelete.length > 0)
    {
        console.log('PREPARING TO DELETE '+selectedFilesToDelete.length+" FILES!\nCLOSE THIS BROWSER WINDOW IMMEDIATELY TO STOP IT!");
    }
    else
    {
        console.log('The delete button was pressed, but the deletion list is empty! How did you manage that?');
        return;
    }

    for (const file of selectedFilesToDelete)
    {
        const response = await fetch(`/api/file/delete/${file.fileId}`, {
            method: "POST",
        })
        .then(res => res.json())
        .then(data => {
            if (data.isDeleted)
            {
                const fileToRemoveFromDOM = document.querySelector(`[data-fileId="${file.fileId}"]`);
                fileToRemoveFromDOM.style.display = "none";
                quickEditDiv.style.display = "none";

                console.log('Successfully deleted',file.name);

                // REMOVE THE FILE from selectedFiles
                let deletedIndex = selectedFiles.findIndex(
                    (f) => f.fileId === file.fileId
                );
                if (deletedIndex !== -1) {
                    selectedFiles.splice(deletedIndex, 1);
                }
            }
            else
            {
                console.log('OH NO! Failed to delete file',file.name);
            }
        });
    }

    deletionWarningDiv.style.display = "none";
}

//DELETE FUNCTIONALITY vvv
trueDeleteButton.addEventListener("click", async () => {
    deleteSelectedFiles();
});

    // let specificFile;
    //NOTE: the file list is acquired from the previously loaded refreshUserUploadsTable.js script
    // simply called "files", this list stores the file objects from the database according to the user's most recent refresh. It is undefined by default
    // setupAllEditButtons();
    // async function setupAllEditButtons()
    // {
    //     try
    //     {
    //         if (files == undefined)
    //         {
    //             //if files hasn't been initiated yet, summon it from db
    //             files = await getUserFilesFromDB(pageUsername); //getUserFilesFromDB is a function from refreshUserUploadsTable.js, as is the files variable itself. As such, refreshUserUploads script must be run before this one!

    //             //TESTER vv
    //             // console.log('Files:',files);
    //         }

    //         allEditButtons.forEach(button => { 
                
    //             //customize the quick edit window that each file-associated event listener will pull up (the pencil edit buttons in the dom for each file)
    //             // vv when individual edit button is clicked vv
    //             button.addEventListener("click", async() => {

    //                 // //vv match button's internal file id to the actual fileid from the filelist
    //                 files.forEach(file =>{
    //                     if (file.fileId == button.dataset.fileid)
    //                     {
    //                         specificFile = file;
    //                     }

                        
    //                     //TESTER vvv
    //                     // console.log('button id',button.dataset.fileid);
    //                 })

    //                 //TESTERS vv
    //                 // console.log(specificFile);
    //                 // console.log('filename:',specificFile.name);

    //                 quickEditDiv.style.display = "flex";

    //                 quickEditDiv.style.top = "50px";
    //                 quickEditDiv.style.left = "5px";

    //                 quickEditFileName.textContent = specificFile.name;
    //                 quickEditFileSize.textContent = calculateFileSize(Number(specificFile.size)); //calculateFileSize is imported from calculateFileSize.js

    //                 commentSubmissionStatus.textContent = "";

                    
    //             });
    //         });
    //     }
    //     catch (error)
    //     {
    //         console.log('ERROR OCCURED TRYING TO QUERY FILES FROM DATABASE FOR EDIT BUTTON FUNCTIONALITY!',error);
    //     }
    // }

//TOGGLE VISIBILITY! VVV
quickEditToggleVisibility.addEventListener("click", async () => {
    const response = await fetch("/api/file/toggleVisibility/"+specificFile.fileId, {
        method: "POST",
    })
    .then(res => res.json())
    .then(data => {
        const desktopEyeball = document.getElementById('desktop-eyeball-'+specificFile.fileId);
        const mobileEyeball = document.getElementById('mobile-eyeball-'+specificFile.fileId);

        if (data.isPublic)
        {
            quickEditToggleVisibilityMessage.textContent = "Visible to internet? TRUE";
            //vv reflect the change in the DOM index
            // console.log(mobileEyeball,desktopEyeball);
            mobileEyeball.style.display = "inline";
            mobileEyeball.innerText = "👁️";

            desktopEyeball.style.display = "inline";
            desktopEyeball.innerText = "👁️";
        } 
        else
        {
            quickEditToggleVisibilityMessage.textContent = "Visible to internet? FALSE";
            mobileEyeball.style.display = "none";
            desktopEyeball.style.display = "none";
        }
    });
});

//DELETION / DELETE BUTTON VVV
quickEditDeleteButton.addEventListener("click", async () => {
    selectedFilesToDelete = [];
    selectedFilesToDelete.push(specificFile);

    deletionWarningDiv.style.display = "inline";

    fileDeletionListDiv.textContent = "";
    fileDeletionListDiv.textContent = specificFile.name;
});

// QUICK EDIT COMMENT SUBMISSION vv
commentSubmissionButton.addEventListener("click", async (event) => {
    event.preventDefault();

    const formData = new FormData();
    
    formData.append("content", document.getElementById("quick-edit-content").value); //attach comment

    const fileInput = document.getElementById("quick-edit-file"); 
    if (fileInput.files.length > 0) 
    {
        formData.append("uploaded_file", fileInput.files[0]); //attach file if it exists
    }

    const response = await fetch("/api/file/addComment/"+pageUsername+"/"+specificFile.fileId, {
        method: "POST",
        body: formData //attached all at once as an object
    })
    .then(res => res.json())
    .then(data => {
        if (data.success)
        {
            console.log('Comment added succesfully!');
            commentSubmissionStatus.textContent = "SUCCESS!";
        }
        else
        {
            commentSubmissionStatus.textContent = "Failed to upload...";
        }
    });
});

    // editFilesButton.addEventListener("click", (event)=>{
    //     if (!editVisible) 
    //     {
    //         editToolbar.style.display = "flex";
    //         editVisible = true;

    //         allEditButtons.forEach( button => { 
    //             button.style.display = "inline-block"; //make them visible
    //         });

    //         allEditCheckboxes.forEach( box => {
    //             box.style.display = "inline-block";
    //         });
    //     }
    //     else
    //     {
    //         editVisible = false;
    //         editToolbar.style.display = "none";

    //         selectAllButton.textContent = "Select All";
    //         isSelectAllToggled = false;

    //         selectedFiles = []; //reset selected files list
    //         selectedFilesToDelete = [];

    //         allEditButtons.forEach( button => {
    //             button.style.display = "none"; //turn them invisible
    //         });

    //         allEditCheckboxes.forEach( box => {
    //             //TESTER
    //             // console.log(box);
    //             box.checked = false;
    //             box.style.display = "none";
    //         });
    //     }
    // });


// DRAG POWER vvv for QUCIK EDIT DIV
const grabButton = document.getElementById('grab-button-quick-edit');

let isDragging = false;

let startX, startY, initialX, initialY;

grabButton.addEventListener('mousedown', (event) => {
    isDragging = true;
    startX = event.clientX;
    startY = event.clientY;
    initialX = quickEditDiv.offsetLeft;
    initialY = quickEditDiv.offsetTop;

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
});

function onMouseMove(event) {
if (isDragging) 
{
    const deltaX = event.clientX - startX;
    const deltaY = event.clientY - startY;
    quickEditDiv.style.left = `${initialX + deltaX}px`;
    quickEditDiv.style.top = `${initialY + deltaY}px`;
}
}

function onMouseUp() 
{
    isDragging = false;
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
}
