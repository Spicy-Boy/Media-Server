const downloadLinks = document.getElementsByClassName("file-name-link");

for (let i = 0; i < downloadLinks.length; i++) {
    const link = downloadLinks[i];

    link.addEventListener("click", (event) => {
        event.preventDefault();

        const username = link.dataset.username;

        //vv this needs to happen for the download to work... not sure why!
        window.open(`/api/file/download/${username}/${link.id}`);
    });
}

