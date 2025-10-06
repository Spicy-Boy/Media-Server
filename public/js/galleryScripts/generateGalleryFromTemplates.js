console.log('LOADING gallery generation script..');

let galleryObjectFromDB; //gallery will be pulled from the server into  here

beginGalleryCreation();

console.log('DOM Gallery Generation Complete!');

// // vv // // // O_O // vv // // // //

async function beginGalleryCreation()
{
    galleryObjectFromDB = await fetchGalleryFromDB();

    generateGalleryDOM();
}

async function fetchGalleryFromDB()
{
    const response = await fetch("/api/image/getGalleryById/"+pageGalleryId, {
        method: "GET"
    });
    const data = await response.json();
    console.log('Gallery data from database:',data);
    return data;
}

function generateGalleryDOM()
{
    const dayContainerTemplate = document.getElementById('gallery-day-template');
    const imageContainerTemplate = document.getElementById('gallery-image-template');
    const galleryContainer = document.getElementById('gallery');

    galleryObjectFromDB.days.forEach(day => { //iterate through each day listed in the gallery
        const dayContainer = dayContainerTemplate.content.cloneNode(true);
        
        const dateHeader = dayContainer.querySelector("h1");
        const rawDate = new Date(day.date);
        const formattedDate = rawDate.toLocaleDateString("en-us", {
            year: "numeric",
            month: "long",
            day: "numeric"
        }); //Month Day, Year format, en-US
        dateHeader.innerText = formattedDate;

        const pictureContainer = dayContainer.querySelector(".gallery-picture-container");

        day.images.forEach(img => {
            const pictureDiv = imageContainerTemplate.content.cloneNode(true).querySelector(".gallery-image");

            //TESTER vv
            // console.log("pictureDiv",pictureDiv);
            // console.log("img",img);

            //NOTE: img._id

            let imageUrl = "/api/image/getByMID/"+img._id;
            pictureDiv.style.backgroundImage = `url(${imageUrl})`;
            // pictureDiv.setAttribute("data-MID", img);

            imageUrlList.push(imageUrl);

            pictureDiv.onclick = () => openFullImage(imageUrl);

            pictureContainer.appendChild(pictureDiv)
        });

        // vv attach finished day to the gallery (with all headers and images attached to it)
        galleryContainer.appendChild(dayContainer);
    })    
}