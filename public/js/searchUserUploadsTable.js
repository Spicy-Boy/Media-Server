// :D

const searchBar = document.getElementById('search-table');
searchBar.value = "";
searchBar.focus();
let tableBodyToSearch = document.getElementById('listBody') //id of table on user portal is "list"

let searchedTableBody = tableBodyToSearch.cloneNode(true); //we work with searchedTable so as not to screw up the original tableBodyToSearch... not greatest naming scheme lol
searchedTableBody.innerHTML = "";

const originalTableHeight = searchedTableBody.offsetHeight;


searchBar.addEventListener("input", ()=>{
    const queryUntouched = searchBar.value; //saved for formatting later
    const query = queryUntouched.trim().toLowerCase();
    searchedTableBody.innerHTML = "";

    //tester vvv
    console.log('queryUntouched:',queryUntouched,"\nquery:",query);

    if (query == "")
    {
        searchedTableBody.replaceWith(tableBodyToSearch);
        console.log('BLANK');
        return;
    }

    const rows = tableBodyToSearch.querySelectorAll("tr"); //grab each row out of the table

    rows.forEach(row => {
        
        const fileTitles = row.querySelectorAll(".file-name-link"); //presumably 2 per row, mobile and desktop formatted title elements

        if (fileTitles[0].textContent.toLowerCase().includes(query)) {
        //tester vv
            // console.log('MATCH!', row);

            const clonedRow = row.cloneNode(true);

            fileTitles.forEach( title => {
                
                let highlightedFileTitles = clonedRow.querySelectorAll(".file-name-link");

                highlightedFileTitles.forEach(highlightedTitle => {

                    textToHighlight = highlightedTitle.textContent;

                    //A REGULAR EXPRESSION!~
                    const regex = new RegExp(`(${query})`, 'gi');
                    const highlightedHTML = textToHighlight.replace(regex, '<span style="background-color: yellow;">$1</span>');

                    highlightedTitle.innerHTML = highlightedHTML;

                    //bad code-- breaks due to innerHTML being unreliable vv
                    // textToHighlight =  textToHighlight.replace(queryUntouched,`<span style="background-color: yellow">${queryUntouched}</span>`);

                    // // let dog = "HAHHAHA"
                    // // textToHighlight =  textToHighlight.replace(queryUntouched,`<span style="background-color: yellow">${dog}</span>`);

                    // highlightedTitle.innerHTML = textToHighlight;
                });

            });

            searchedTableBody.appendChild(clonedRow);
        }
    //tester vvv
        // else
        // {
        //     console.log('NO MATCH');
        // }
    });

    // tableBodyToSearch.style.minHeight = originalTableHeight+"px"; //preserves height to prevent page jumps while searching
    // console.log(tableBodyToSearch.style.minHeight,'+',searchedTableBody.style.minHeight);
    tableBodyToSearch.replaceWith(searchedTableBody);


});