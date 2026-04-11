let fileInput = document.getElementById('input-test-file-upload');

let fileInputButton = document.getElementById('button-test-file-upload');

fileInputButton.addEventListener('click', () => {
    console.log('File input value:', fileInput.value);
    let file = fileInput.files[0];
    console.log('Selected file:', file);

    const fileDate = new Date(file.lastModified);
    console.log('Raw date:', fileDate);
    console.log('Better Format:',fileDate.toLocaleString());
});