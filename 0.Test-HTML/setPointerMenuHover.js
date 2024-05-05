let selectionMenu = document.getElementById('selection-menu');

let links = selectionMenu.querySelectorAll('a');

let pointer = document.getElementById('pointer');

const selectedLink = null;

//e = element below
links.forEach((link) => {
    link.addEventListener("mouseenter", (event) => {
        //indent link slightly on hover
        link.style.paddingLeft = 35+"px";

        //place pointer next to link
        let linkRectangle = link.getBoundingClientRect();

        pointer.style.top = linkRectangle.top+"px";

        // let linkRectangle = link.getBoundingClientRect();
        // // console.log('hi aaron',link);
        // // pointer.style.height = link.style.height;
        // pointer.style.height = 43+"px";
        // let pointerWidth = pointer.clientWidth;
        // pointer.style.left = linkRectangle.left - pointerWidth.left+"px";

        // pointer.style.top

    });
   link.addEventListener("mouseleave", () => {
    //    link.style.marginLeft = ""; 
        link.style.paddingLeft = 0+"px";
        // console.log('bye aaron',link); 
    });
});



