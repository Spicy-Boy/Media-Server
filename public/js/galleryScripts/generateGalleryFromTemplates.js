console.log('LOADING gallery generation script..');

let galleryObjectFromDB; //gallery will be pulled from the server

await beginGalleryCreation();

console.log('DOM Generation Complete!');

// // // // // O_O // // // // //

async function beginGalleryCreation()
{
    galleryObjectFromDB = await fetchGalleryFromDB();

    generateGalleryDOM();
}

async function fetchGalleryFromDB()
{
    
}

function generateGalleryDOM()
{

}