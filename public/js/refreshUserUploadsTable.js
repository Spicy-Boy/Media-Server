// :D
let refreshButton = document.getElementById('refresh-uploads');

let refreshInProgress = false;

refreshButton.addEventListener("click", (event) => {
    if (!refreshInProgress)
    {
        refreshInProgress = true;
        generateNewUploadList();
        const searchBar = document.getElementById('search-table');
        searchBar.value = "";
    }


});

//NOTE: an html template that could be cloned would be far more effective than manually creating elements w/ js
//vvv grabs a table element id, erases its contents, and re-queries the database. Use JS to recreate all elements of the list
async function generateNewUploadList()
{
    let tableBody = document.getElementById('listBody')

    let files = await getUserFilesFromDB(pageUsername); //variable set by server in the userPortal template

    files.reverse();

    tableBody.innerHTML = "";

    const template = document.getElementById('upload-row-template');

    //v reversed simply because this is how the user portal page presents files by default
    files.forEach((file, index) => { //using js, create each rows in table based on refreshed data
        
        const clonedRow = template.content.cloneNode(true); //clone a new row from template
        const row = clonedRow.querySelector("tr"); //grab the row element from the cloned row

        row.setAttribute("data-filename", file.name);
        row.setAttribute("data-filesize", file.size);
        row.setAttribute("data-filedate", file.date);

        //grab each instance of file name link and populate it
        clonedRow.querySelectorAll(".file-name-link").forEach(link => {
            link.textContent = file.name;
            link.id = file.fileId;
            link.setAttribute("data-username", pageUsername); //pageUsername is set in header of main html document
        });

        //grab each instance of file link and populate it with download route
        clonedRow.querySelectorAll(".file-link").forEach(link => {
            link.href = "/u/"+pageUsername+"/"+file.fileId;
        });

        //grab each instance of the fileSize span and populate it with raw size data
        clonedRow.querySelectorAll(".fileSize").forEach(span => {
            let basicSize = Number(file.size);
            span.innerText = calculateFileSize(basicSize);
        });

        //format the file's date, then attach to date spans
        const dateUploaded = new Date(file.date);
        let month = dateUploaded.getMonth() + 1;
        let day = dateUploaded.getDate();
        let year = dateUploaded.getFullYear();
        let calendarDate = `${month}/${day}/${year}`;
        clonedRow.querySelectorAll(".uploadDate").forEach(span => {
            span.textContent = calendarDate;
        });

        //check if file is public facing, add an eyeball emoji w tooltip to end of date column
        if (file.isPublic)
        {
            const icon = clonedRow.querySelector(".publicIcon"); //this is the mobile facing eye
            icon.innerText = "👁️";
            icon.style.display = "inline";

            clonedRow.querySelectorAll(".publicIconTooltip").forEach(div => {
                div.innerHTML = "👁️"+div.innerHTML;
                div.style.display = "inline";
            });
        }

        tableBody.appendChild(clonedRow);

    //*&*&* VVV OLDE JS VVV generation method, infinitely inferior to the cloning of templates!
        // let row = document.createElement("tr");
        
        // row.setAttribute("data-filename", file.name);
        // row.setAttribute("data-filesize", file.size);
        // row.setAttribute("data-filedate", file.date);

        // //name column
        // let nameColumn = document.createElement("td");
        // nameColumn.classList.add("upload-list-name-column");
        
        // let nameLink = document.createElement("a");
        // nameLink.id = file.fileId;
        // nameLink.href = "#";
        // nameLink.textContent = file.name;
        // nameLink.setAttribute("data-username", pageUsername);
        // nameLink.classList.add("file-name-link", "mobile-invisible");
        // nameColumn.appendChild(nameLink);

        // //mobile name column AKA mobile file details
        // let mobileLinkDiv = document.createElement('div');
        // mobileLinkDiv.classList.add("mobile-file-details","desktop-invisible", "font-eight-bold");

        // let mobileNameLink = document.createElement('a');
        // mobileNameLink.href = "#";
        // mobileNameLink.classList.add("file-name-link");
        // mobileNameLink.style.paddingTop = "5px";
        // mobileNameLink.setAttribute("data-username", pageUsername);
        // mobileNameLink.innerText = file.name;
        // mobileLinkDiv.appendChild(mobileNameLink);
        // nameColumn.appendChild(mobileLinkDiv);

        // let mobileDetailsDiv = document.createElement('div');
        // mobileDetailsDiv.classList.add("mobile-file-details","desktop-invisible");
        // mobileDetailsDiv.style.paddingTop = "15px";

        // let span1 = document.createElement('span');
        // span1.innerText = "🔗";
        // let mobilePermaLink = document.createElement('a');
        // mobilePermaLink.href="/u/"+pageUsername+"/"+file.fileId;
        // mobilePermaLink.style.textDecoration = "underline";
        // mobilePermaLink.innerText = "LINK";


        // mobileDetailsDiv.appendChild(span1);
        // nameColumn.appendChild(mobileDetailsDiv);
        

        // row.appendChild(nameColumn);

        // tableBody.appendChild(row);
    });
    
    refreshInProgress = false;

    //vv called from an already loaded instance of createDownloadLinks.js
    createDownloadLinks();
    tableFullBackup = tableBody.cloneNode(true); //tableFullBackup is set in 
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

