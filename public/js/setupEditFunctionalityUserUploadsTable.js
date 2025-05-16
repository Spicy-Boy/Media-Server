//NOTE TO AARON:

//You need to make sure only admins or the user that uploaded a file can edit its contents

let editFilesButton = document.getElementById('edit-uploads');

let editVisible = false;

let allEditCheckboxes = document.querySelectorAll(".checkbox-file-user-portal");

let allEditButtons = document.querySelectorAll(".edit-file-button-user-portal");

allEditButtons.forEach(button => {
    button.addEventListener("click", () => {
        let buttonId = button.dataset.fileid;
        
    });
})

editFilesButton.addEventListener("click", (event)=>{
    if (!editVisible) 
    {
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

        allEditButtons.forEach( button => {
            button.style.display = "none"; //turn them invisible
        });

        allEditCheckboxes.forEach( box => {
            box.style.display = "none";
        });
    }
});