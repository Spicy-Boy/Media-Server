// :D

const searchBar = document.getElementById('search-table');
let tableBody = document.getElementById('list') //id of table on user portal is "list"

searchBar.addEventListener("input", ()=>{
    const query = searchBar.value.toLowerCase();
    const rows = tableBody.querySelectorAll("tr"); //grab each row out of the table

    rows.forEach(row => {
        const fileTitle = row.querySelector("file-name-link");

        if (fileTitle.includes(query)) {

        }
    });
});