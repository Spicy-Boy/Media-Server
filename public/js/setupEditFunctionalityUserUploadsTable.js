//NOTE TO AARON:

//You need to make sure only admins or the user that uploaded a file can edit its contents

let editFilesButton = document.getElementById('edit-uploads');
let editToolbar = document.getElementById('edit-toolbar');

let editVisible = false;

//array of all the checkboxes next to the file names
let allEditCheckboxes = document.querySelectorAll(".checkbox-file-user-portal");

//array of all the edit buttons next to the file names
let allEditButtons = document.querySelectorAll(".edit-file-button-user-portal");

//button on the utility bar that can select or deselect all uploads
let selectAllButton = document.getElementById('select-all-uploads');
let isSelectAllToggled = false;

// when a file is "selected" by checking its box, its parent DOM element is added to a list to be processed
let selectedFiles = [];

allEditCheckboxes.forEach(box => {
    box.addEventListener("change", (e) => {

        if (e.target.checked)
        {
            selectedFiles.push({
                fileId: box.dataset.fileid,
                fileName: box.dataset.filename
            });
        }
        else
        {
            selectedFiles = selectedFiles.filter(file => file.fileId !== box.dataset.fileid);
            // ^^ clever little function to filter out the deselected file from the list
        }

        //TESTER vv
        console.log("Selected List:",selectedFiles);
    });
});

selectAllButton.addEventListener("click", () => {

    if (!isSelectAllToggled)
    {
        selectAllButton.textContent = "Deselect All";

        selectedFiles = [];

        allEditCheckboxes.forEach(box => {
            box.checked = true;

            selectedFiles.push({
                fileId: box.dataset.fileid,
                fileName: box.dataset.filename
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

const quickEditDiv = document.getElementById('quick-edit-div');

const quickEditCloseButton = document.getElementById('button-close-quick-edit');
quickEditCloseButton.addEventListener("click", () => {
    quickEditDiv.style.display = "none";
});

//DOM elements to change every time the quick edit menu is open!
const quickEditFileName = document.getElementById('quick-edit-filename');
const quickEditFileSize = document.getElementById('quick-edit-filesize');
const quickEditToggleVisibility = document.getElementById('quick-edit-toggle-visibility');
const quickEditDeleteButton = document.getElementById('quick-edit-delete');
const quickEditCommentForm = document.getElementById('quick-edit-comment-form');

//NOTE: the file list is acquired from the previously loaded refreshUserUploadsTable.js script
// simply called "files", this list stores the file objects from the database according to the user's most recent refresh

allEditButtons.forEach(button => { 
    //customize the quick edit window here for each individual file
    button.addEventListener("click", () => {

        let specificFile;

        if (files == undefined)
        {
            console.log('Action ceased: wait for file list to load from server..');
            return;
        }
        else
        {
            //vv match button's internal file id to the actual fileid from the filelist
            specificFile = files.find(file => file.fileId === button.dataset.fileid);
            console.log(specificFile);
        }
        
        quickEditDiv.style.display = "flex";

        quickEditDiv.style.top = "5px";
        quickEditDiv.style.left = "5px";

        quickEditFileName.textContent = "hi";
    });
})

editFilesButton.addEventListener("click", (event)=>{
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

        allEditButtons.forEach( button => {
            button.style.display = "none"; //turn them invisible
        });

        allEditCheckboxes.forEach( box => {
            box.checked = false;
            box.style.display = "none";
        });
    }
});

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

//ensures all boxes vv are unchecked when page loads [ ]
document.addEventListener("DOMContentLoaded", () => {
    allEditCheckboxes.forEach(box => box.checked = false);
});
