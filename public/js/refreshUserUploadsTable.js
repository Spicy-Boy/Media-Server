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


//vvv grabs a table element id, erases its contents, and re-queries the database. Use JS to recreate all elements of the list
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

        //name column
        let nameColumn = document.createElement("td");
        nameColumn.classList.add("upload-list-name-column");
        
        let nameLink = document.createElement("a");
        nameLink.id = file.fileId;
        nameLink.href = "#";
        nameLink.textContent = file.name;
        nameLink.setAttribute("data-username", pageUsername);
        nameLink.classList.add("file-name-link", "mobile-invisible");
        nameColumn.appendChild(nameLink);

        //mobile name column AKA mobile file details
        let mobileLinkDiv = document.createElement('div');
        mobileLinkDiv.classList.add("mobile-file-details","desktop-invisible", "font-eight-bold");

        let mobileNameLink = document.createElement('a');
        mobileNameLink.href = "#";
        mobileNameLink.classList.add("file-name-link");
        mobileNameLink.style.paddingTop = "5px";
        mobileNameLink.setAttribute("data-username", pageUsername);
        mobileNameLink.innerText = file.name;
        mobileLinkDiv.appendChild(mobileNameLink);
        nameColumn.appendChild(mobileLinkDiv);

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

