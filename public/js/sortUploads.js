function sortTableAlphabetically()
{
    const table = document.querySelector('table'); 

    const rows = Array.from(table.querySelectorAll('tr'));

    // vv header needs to be removed so it doesn't get caught up in the sorting
    const headerRow = rows.shift();

    rows.sort(function(rowA, rowB) {
        var filenameA = rowA.getAttribute('data-filename').toLowerCase();

        var filenameB = rowB.getAttribute('data-filename').toLowerCase();
        
        // Compare the file names
        if (filenameA < filenameB) {
            return -1;
        }
        if (filenameA > filenameB) {
            return 1;
        }
        return 0;
    });

    table.innerHTML = ''; 

    //re-attach header, append newly sorted rows to table
    table.appendChild(headerRow);
    rows.forEach(function(row) {
    table.appendChild(row);
  });
}

function sortTableAlphabeticallyReversed()
{
    const table = document.querySelector('table'); 

    const rows = Array.from(table.querySelectorAll('tr'));

    // vv header needs to be removed so it doesn't get caught up in the sorting
    const headerRow = rows.shift();

    rows.sort(function(rowA, rowB) {
        var filenameA = rowA.getAttribute('data-filename').toLowerCase();

        var filenameB = rowB.getAttribute('data-filename').toLowerCase();
        
        // Compare the file names
        if (filenameA > filenameB) {
            return -1;
        }
        if (filenameA < filenameB) {
            return 1;
        }
        return 0;
    });

    table.innerHTML = '';

    //re-attach header, append newly sorted rows to table
    table.appendChild(headerRow);
    rows.forEach(function(row) {
    table.appendChild(row);
  });
}

function sortTableSmallestFirst()
{
    const table = document.querySelector('table'); 

    const rows = Array.from(table.querySelectorAll('tr'));

    // vv header needs to be removed so it doesn't get caught up in the sorting
    const headerRow = rows.shift();

            rows.sort(function(rowA, rowB) {
            
            //vv must cast the strings to a number type
            var filesizeA = parseFloat(rowA.getAttribute('data-filesize'));

            var filesizeB = parseFloat(rowB.getAttribute('data-filesize'));
            
            return filesizeA - filesizeB
        });

        table.innerHTML = '';

        //re-attach header, append newly sorted rows to table
        table.appendChild(headerRow);
        rows.forEach(function(row) {
        table.appendChild(row);
    });
}
function sortTableLargestFirst()
{
    const table = document.querySelector('table'); 

    const rows = Array.from(table.querySelectorAll('tr'));

    // vv header needs to be removed so it doesn't get caught up in the sorting
    const headerRow = rows.shift();

            rows.sort(function(rowA, rowB) {
            var filesizeA = parseFloat(rowA.getAttribute('data-filesize'));

            var filesizeB = parseFloat(rowB.getAttribute('data-filesize'));
            
            return filesizeB - filesizeA
        });

        table.innerHTML = '';

        //re-attach header, append newly sorted rows to table
        table.appendChild(headerRow);
        rows.forEach(function(row) {
        table.appendChild(row);
    });



}

// sortTableAlphabetically();
// sortTableAlphabeticallyReversed();