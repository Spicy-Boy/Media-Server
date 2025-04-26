// :D

let refreshButton = document.getElementById('refresh-uploads-button');

refreshButton.addEventListener("click", (event) => {

});

//vvv grabs a table element id, erases its contents, and re-queries the database 
function generateNewUploadsListFromDB()
{
    let listContainer = document.getElementById("list"); //in our case, a table element

    //first we make the header
    let header = document.createElement("thead");
    
}

async function getUserFilesFromDB(username)
{
    try { //robot shit, gotta look :P
        const response = await fetch(`/your-route/${username}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`Server error: ${response.statusText}`);
        }

        const files = await response.json();
        console.log(files); // handle the list of files here
    } catch (error) {
        console.error('Error fetching user files:', error);
    }
}

