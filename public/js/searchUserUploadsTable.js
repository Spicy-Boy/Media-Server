// :D

const searchBar = document.getElementById('search-table');
searchBar.value = "";
searchBar.focus();
let tableBody = document.getElementById('listBody') //id of table on user portal is "list"


searchBar.addEventListener("input", ()=>{
    const query = searchBar.value.toLowerCase();
    const rows = tableBody.querySelectorAll("tr"); //grab each row out of the table

    rows.forEach(row => {
        
        const nameColumn = row.querySelector(".upload-list-name-column");
        const fileTitle = nameColumn?.querySelector(".file-name-link");

        if (fileTitle.textContent.includes(query)) {
            console.log('HAHA');
        }
    });
});