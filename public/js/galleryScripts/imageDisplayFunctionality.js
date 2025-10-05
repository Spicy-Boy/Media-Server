
console.log('LOADING image display script..');

let imageUrlList = []; //to store image urls for traversal
let currentImageIndex = -1; //keep track of currently opened image

//functions vvv for enlarging selected image and closing the display
function openFullImage(src)
{
    //TESTER VVV
    // console.log('OPENING!');

    const display = document.getElementById('image-display');
    const image = document.getElementById('image-to-be-displayed');

    currentImageIndex = imageUrlList.indexOf(src); //match image url to the url list to get an index

    image.src = src;
    display.classList.remove("hidden");
}

function closeDisplayOnClickingBackdrop(event) {
    // Only trigger close if the backdrop itself was clicked
    if (event.target.id === "image-display") {
        closeDisplay();
    }
}

function closeDisplay() {
    document.getElementById("image-display").classList.add("hidden");
}

//keyboard controls!! vv

document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") 
    {

        currentImageIndex = currentImageIndex - 1;
        if (currentImageIndex < 0)
        {
            currentImageIndex = imageUrlList.length - 1;
        }
        //TESTER vv
        // console.log("Index!",currentImageIndex);

        openFullImage(imageUrlList[currentImageIndex]);
    }
    if (event.key === "ArrowRight") 
    {
        currentImageIndex = currentImageIndex + 1;
        if (currentImageIndex > imageUrlList.length - 1)
        {
            currentImageIndex = 0;
        }
        //TESTER vv
        // console.log("Index!",currentImageIndex);

        openFullImage(imageUrlList[currentImageIndex]);
    }
    if (event.key === "Escape") {
        closeDisplay();
    }
});

//DOM-based left right controls vv

let imageLeftArrow = document.getElementById('image-display-left-arrow');
let imageRightArrow = document.getElementById('image-display-right-arrow');

imageLeftArrow.onclick = () => {

        currentImageIndex = currentImageIndex - 1;
        if (currentImageIndex < 0)
        {
            currentImageIndex = imageUrlList.length - 1;
        }
        //TESTER vv
        // console.log("Index!",currentImageIndex);

        openFullImage(imageUrlList[currentImageIndex]);   
}

imageRightArrow.onclick = () => {
    currentImageIndex = currentImageIndex + 1;
    if (currentImageIndex > imageUrlList.length - 1)
    {
        currentImageIndex = 0;
    }
    //TESTER vv
    // console.log("Index!",currentImageIndex);

    openFullImage(imageUrlList[currentImageIndex]);
}