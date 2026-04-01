/* HTML Manipulation code vvv */
let revealButton = document.getElementById("notes-reveal-button");

// vvv reveals the notes submission panel and its embedded form when the button above is clicked
revealButton.addEventListener("click", function () {

    const notesSubmissionPanel = document.getElementById("notes-submission-panel");

    notesSubmissionPanel.classList.toggle("active");

    if (notesSubmissionPanel.classList.contains("active")) 
    {
        revealButton.textContent = "[-] Notes";
    }
    else 
    {
        revealButton.textContent = "[+] Notes";
    }
});

/* DATA SUBMISSION CODE vvv*/
const notesSubmissionForm = document.getElementById('notes-submission-form');
const notesSubmissionStatus = document.getElementById('notes-submission-status');
const notesSubmissionButton = document.getElementById('notes-submission-button');
const noteSubmissionStatus = document.getElementById('notes-submission-status');

notesSubmissionButton.addEventListener('click', async (event) => {
    event.preventDefault();

    const formData = new FormData();

    //vv add title from note form
    formData.append("title", document.getElementById("notes-submission-title").value);
    //vv add content from note form
    formData.append("content", document.getElementById("notes-submission-content").value);
    //vv add image file from note form
    const fileInput = document.getElementById("notes-submission-file");

    if (fileInput.isDefaultNamespace.length > 0)
    {
        formData.append("uploaded_file", fileInput.files[0]); //only attaches the first file to the form data... no multi image submissions!
    }

    const response = await fetch("/api/file/addNote/"+pageUsername, {
        method: "POST",
        body: formData
    })
    .then(res => res.json())
    .then(data => {

        //TESTER vvv
        console.log(data);

        if (data.success)
        {
            console.log('Note uploaded successfully!');
            noteSubmissionStatus.textContent = "Note uploaded successfully!";

            //erase the existing note window and file selection
            document.getElementById("notes-submission-content").value = "";
            document.getElementById("notes-submission-title").value = "";
            fileInput.value = "";
        }
        else
        {
            if (data.error)
            {
                noteSubmissionStatus.textContent = "ERROR: "+data.error;
            }
            else
            {
                noteSubmissionStatus.textContent = "Note failed to upload! No error provided..";
            }

        }
    })
});
