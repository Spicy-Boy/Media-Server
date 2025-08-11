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

selectAllButton.addEventListener("click", () => {

    if (!isSelectAllToggled)
    {
        selectAllButton.textContent = "Deselect All";
        allEditCheckboxes.forEach(box => {
            box.checked = true;
            isSelectAllToggled = true;
        });
    }
    else
    {
        selectAllButton.textContent = "Select All";
        allEditCheckboxes.forEach(box => {
            box.checked = false;
            isSelectAllToggled = false;
        });
    }
});

const quickEditDiv = document.getElementById('quick-edit-div');

const quickEditCloseButton = document.getElementById('button-close-quick-edit');
quickEditCloseButton.addEventListener("click", () => {
    quickEditDiv.style.display = "none";
});

const quickEditFileSize = document.querySelector(".quick-edit-filesize")

allEditButtons.forEach(button => { 
    //customize the quick edit window here for each individual file
    button.addEventListener("click", () => {
        
        quickEditDiv.style.display = "flex";

        quickEditDiv.style.top = "5px";
        quickEditDiv.style.left = "5px";

        let buttonId = button.dataset.fileid;
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

