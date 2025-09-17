// :D

const searchBar = document.getElementById('search-table');
searchBar.value = "";
searchBar.focus();

let tableBodyToSearch = document.getElementById('listBody'); //id of table on user portal is "list"

// vv saved HTML to be restored after highlighting is done
tableBodyToSearch.querySelectorAll(".file-name-link").forEach(link => {
    link.dataset.originalHTML = link.innerHTML;
});

function escapeRegExp(string) { //gets rid of the weird regex codes so they don't mess with my search
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

searchBar.addEventListener("input", () => {
    const queryUntouched = searchBar.value; //saved for formatting later
    const query = queryUntouched.trim().toLowerCase();
    //tester vvv
    // console.log('queryUntouched:',queryUntouched,"\nquery:",query);

    const rows = tableBodyToSearch.querySelectorAll("tr"); //grab each row out of the table

    if (query == "") //reset table visibility when searchbar empty
    {
        rows.forEach(row => {
            row.style.display = '';
            row.querySelectorAll('.file-name-link').forEach(link => {
                if (link.dataset.originalHTML)
                {
                    link.innerHTML = link.dataset.originalHTML; //reset the link to its pre-highlighted html
                } 
            });
    });
    }

    rows.forEach(row => {
        
        const fileTitleLinks = row.querySelectorAll(".file-name-link"); //presumably 2 per row, mobile and desktop formatted title elements

        if (fileTitleLinks[0].textContent.toLowerCase().includes(query)) 
        {
            //tester vv
            // console.log('MATCH!', row);

            row.style.display = "";

            fileTitleLinks.forEach( titleLink => {
                
                const originalTitle = titleLink.dataset.originalHTML;

                const regex = new RegExp(`(${escapeRegExp(query)})`, 'gi');
                titleLink.innerHTML = originalTitle.replace(regex, '<span style="background-color: yellow;">$1</span>');
            });
        }
        else
        {
            row.style.display = 'none';
        }
    //tester vvv
        // else
        // {
        //     console.log('NO MATCH');
        // }
    });

    const pageWrapper = document.getElementById('upload-and-list-wrapper');
    const blankSpace = document.createElement("div");
    blankSpace.style.height = "200px";
    pageWrapper.appendChild(blankSpace);

    createDownloadLinks();
});