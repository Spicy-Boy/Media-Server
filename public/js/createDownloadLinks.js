const downloadLinks = document.getElementsByClassName("file-name-link");

for (let i = 0; i < downloadLinks.length; i++) {
    const link = downloadLinks[i];

    link.addEventListener("click", (event) => {
        event.preventDefault();
        console.log("DOWNLOAD CLICKED!",link);

        const username = link.dataset.username;

        fetch(`/api/file/download/${username}/${link.id}`, {
            method: "GET",
        });
    });
}

