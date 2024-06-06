const uploadFiles = (() => {

    const defaultOptions = {
        url: "/",
        onAbort() {},
        onError() {},
        onProgress() {},
        onComplete() {}

    }

    // vv the magic happens here, upload each file individually
    const uploadFile = (file, options) => {

        // create an XMLHttpRequest to asynchronously manage an upload without page change
        const req = new XMLHttpRequest();

        // vv add data to request body
        const formData = new FormData();
        formData.append('file', file, file.name) //params: name (like the variable in a hard coded form), the literal file data, file name

        req.open('POST', options.url, true); //params: method (POST), url or request, async (true)

        /* You can listen for request events after opening the request */
        req.onload = () => options.onComplete();
        // req.onloadstart = () => {};
        // req.onloadend = () => {};
        req.onerror = () => options.onError(e);
        req.ontimeout = () => options.onError(e);
        // req.onprogress = () => {};
        req.upload.onprogress = () => options.onProgress();
        req.onabort = () => options.onAbort();

        req.send(formData);
    }

    return (files, options = defaultOptions) => {
        // vv spread the file list to turn it into an array, then iterate
        [...files].forEach( file => uploadFile(file, {...defaultOptions, ...options}));
    }
})();

const uploadAndTrackFiles = ( () => {

    const onProgress = () => {
        console.log('-- progress');
    };

    const onError = () => {
        console.log('-- error');
    };

    const onAbort = () => {
        console.log('-- abort');
    };

    const onComplete = () => {
        console.log('-- complete');
    };

    return (uploadedFiles) => {
        uploadFiles(uploadedFiles, {
            path: "/",
            onComplete,
            onAbort,
            onError,
            onProgress
        })
    }
})();

const uploadButton = document.getElementById('upload-button');

uploadButton.addEventListener("change", (event) => {
    console.log('--event:',event.target.files);

    uploadAndTrackFiles(event.target.files);
});