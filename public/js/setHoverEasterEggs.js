function changeImgOnHover(imgID, newImgSrc)
{
    let imageToChange = document.getElementById(imgID);
    let originalSrc = imageToChange.src;
    imageToChange.addEventListener("mouseenter", () => {
        imageToChange.src=newImgSrc;
    });

    imageToChange.addEventListener("mouseleave", () => {
        imageToChange.src=originalSrc;
    });
}