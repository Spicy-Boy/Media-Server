// :D
let refreshButton = document.getElementById('refresh-uploads');

let refreshInProgress = false;

refreshButton.addEventListener("click", (event) => {
    if (!refreshInProgress)
    {
        refreshInProgress = true;
        generateNewUploadList();
    }


});


//vvv grabs a table element id, erases its contents, and re-queries the database 
async function generateNewUploadList()
{
    let listContainer = document.getElementById("list"); //in our case, a table element
    let tableBody = listContainer.querySelector("tbody");

    let files = await getUserFilesFromDB(pageUsername); //variable set by server in the userPortal template

    files.reverse();

    tableBody.innerHTML = "";

    //v reversed simply because this is how the user portal page presents files by default
    files.forEach((file, index) => { //using js, create new rows in table based on refreshed data
        let row = document.createElement("tr");
        
        row.setAttribute("data-filename", file.name);
        row.setAttribute("data-filesize", file.size);
        row.setAttribute("data-filedate", file.date);


        let nameColumn = document.createElement("td");
        nameColumn.classList.add("upload-list-name-column");
        
        let nameLink = document.createElement("a");
        nameLink.id = file.fileId;
        nameLink.href = "#";
        nameLink.textContent = file.name;
        nameLink.setAttribute("data-username", file.name);
        nameLink.classList.add("file-name-link", "mobile-invisible");
        nameColumn.appendChild(nameLink);

        let mobileLinkDiv = document.createElement('div');
        let mobileNameLink = document.createElement('a');

        row.appendChild(nameColumn);

        tableBody.appendChild(row)
    });
    
    
}

//phones up the API and retrieves a list of uploaded files from the user's database
async function getUserFilesFromDB(username)
{
    try {
        const response = await fetch(`/api/file/sendUsersFileListToWebpage/${username}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            console.log("Error retrieving user's file list from server: ", response.statusText);
        }

        const files = await response.json();

        return files;

    } catch (error) {
        console.log("Needless to say, the refresh button didn't work...");
    }
}

