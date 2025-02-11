
//alphabetical sorting vvv mobile and desktop buttons
let toggleAlphabeticalSortUpward = true;

const sortByNameButton = document.getElementById('sortByName');

sortByNameButton.addEventListener("click", (event)=>{
    event.preventDefault();

    if (toggleAlphabeticalSortUpward)
    {
        console.log('Sorting uploads alphabetically a-z');
        sortTableAlphabetically();
        toggleAlphabeticalSortUpward = false;
    }
    else
    {
        console.log('Sorting uploads alphabetically z-a');
        sortTableAlphabeticallyReversed();
        toggleAlphabeticalSortUpward = true;
    }
});
const sortByNameMobileButton = document.getElementById('sortByNameMobile');
sortByNameMobileButton.addEventListener("click", (event)=>{
    event.preventDefault();

    if (toggleAlphabeticalSortUpward)
    {
        console.log('Sorting uploads alphabetically a-z');
        sortTableAlphabetically();
        toggleAlphabeticalSortUpward = false;
    }
    else
    {
        console.log('Sorting uploads alphabetically z-a');
        sortTableAlphabeticallyReversed();
        toggleAlphabeticalSortUpward = true;
    }
});

//size sorting (file size) vvv desktop and mobile
let toggleSizeSortLargest = true;
const sortBySizeButton = document.getElementById('sortBySize');

sortBySizeButton.addEventListener("click", (event)=>{
    event.preventDefault();

    if (toggleSizeSortLargest)
    {
        sortTableLargestFirst();
        toggleSizeSortLargest = false;
    }
    else
    {
        sortTableSmallestFirst();
        toggleSizeSortLargest = true;
    }
});

const sortBySizeMobileButton = document.getElementById('sortBySizeMobile');

sortBySizeMobileButton.addEventListener("click", (event)=>{
    event.preventDefault();

    if (toggleSizeSortLargest)
    {
        sortTableLargestFirst();
        toggleSizeSortLargest = false;
    }
    else
    {
        sortTableSmallestFirst();
        toggleSizeSortLargest = true;
    }
});



//date sorting (upload date) vvv desktop and mobile
let toggleDateSortOldest = true;
const sortByDateButton = document.getElementById('sortByDate');
sortByDateButton.addEventListener("click", (event)=>{
    event.preventDefault();

    if (toggleDateSortOldest)
    {
        sortTableDateOldest();
        toggleDateSortOldest = false;
    }
    else
    {
        sortTableDateYoungest();
        toggleDateSortOldest = true;
    }
});

const sortByDateMobileButton = document.getElementById('sortByDateMobile');
sortByDateMobileButton.addEventListener("click", (event)=>{
    event.preventDefault();

    if (toggleDateSortOldest)
    {
        sortTableDateOldest();
        toggleDateSortOldest = false;
    }
    else
    {
        sortTableDateYoungest();
        toggleDateSortOldest = true;
    }
});