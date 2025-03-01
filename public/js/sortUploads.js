function sortTableAlphabetically()
{
    const table = document.querySelector('tbody'); 

    const rows = Array.from(table.querySelectorAll('tr'));

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

    rows.forEach(function(row) {
    table.appendChild(row);
  });
}

function sortTableAlphabeticallyReversed()
{
    const table = document.querySelector('tbody'); 

    const rows = Array.from(table.querySelectorAll('tr'));

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

    rows.forEach(function(row) {
    table.appendChild(row);
  });
}

function sortTableSmallestFirst()
{
    const table = document.querySelector('tbody'); 

    const rows = Array.from(table.querySelectorAll('tr'));

    // vv header needs to be removed so it doesn't get caught up in the sorting

        rows.sort(function(rowA, rowB) {
            
            //vv must cast the strings to a number type
            var filesizeA = parseFloat(rowA.getAttribute('data-filesize'));

            var filesizeB = parseFloat(rowB.getAttribute('data-filesize'));
            
            return filesizeA - filesizeB
        });

        table.innerHTML = '';

        rows.forEach(function(row) {
        table.appendChild(row);
    });
}
function sortTableLargestFirst()
{
    const table = document.querySelector('tbody'); 

    const rows = Array.from(table.querySelectorAll('tr'));

        rows.sort(function(rowA, rowB) {
            var filesizeA = parseFloat(rowA.getAttribute('data-filesize'));

            var filesizeB = parseFloat(rowB.getAttribute('data-filesize'));
            
            return filesizeB - filesizeA
        });

        table.innerHTML = '';

        rows.forEach(function(row) {
        table.appendChild(row);
    });
}

function sortTableDateOldest()
{
    const table = document.querySelector('tbody'); 

    const rows = Array.from(table.querySelectorAll('tr'));

        rows.sort(function(rowA, rowB) {
            var filedateA = new Date(rowA.getAttribute('data-filedate'));

            var filedateB = new Date(rowB.getAttribute('data-filedate'));
            
            return filedateA - filedateB
        });

        table.innerHTML = '';

        rows.forEach(function(row) {
        table.appendChild(row);
    });
}

function sortTableDateYoungest()
{
    const table = document.querySelector('tbody'); 

    const rows = Array.from(table.querySelectorAll('tr'));

        rows.sort(function(rowA, rowB) {
            var filedateA = new Date(rowA.getAttribute('data-filedate'));

            var filedateB = new Date(rowB.getAttribute('data-filedate'));
            
            return filedateB - filedateA
        });

        table.innerHTML = '';

        rows.forEach(function(row) {
        table.appendChild(row);
    });
}

// FUTURE FUNCTIONS
//sort by release date (just make release date a date object)
//sort by author alphabetically
