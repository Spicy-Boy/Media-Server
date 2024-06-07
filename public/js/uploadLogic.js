const uploadFiles = (() => {

    const fileRequests = new WeakMap(); //keeps track of the requests sent

    const defaultOptions = {
        url: "/api/suicune/uploadXML",
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
        req.onload = (e) => options.onComplete(e, file);
        // req.onloadstart = () => {};
        // req.onloadend = () => {};
        req.onerror = (e) => options.onError(e, file);
        req.ontimeout = (e) => options.onError(e, file);
        // req.onprogress = () => {};
        req.upload.onprogress = (e) => options.onProgress(e, file);
        req.onabort = (e) => options.onAbort(e, file);

        fileRequests.set(file, {request: req, options});

        req.send(formData);
    }

    const abortFileUpload = (file) => {
        const fileReq = fileRequests.get(file);

        if (fileReq) {
            fileReq.request.abort();
        }
    }

    // vv remove a file from the requests map
    const clearFileUpload = (file) => {
        abortFileUpload(file);
        fileRequests.delete(file);
    }

    return (files, options = defaultOptions) => {
        // vv spread the file list to turn it into an array, then iterate
        [...files].forEach( file => uploadFile(file, {...defaultOptions, ...options}));

        return {
            abortFileUpload,
            clearFileUpload
        }
    }
})();

const uploadAndTrackFiles = ( () => {

    let uploader = {};

    const FILE_STATUS = {
        PENDING: 'pending',
        UPLOADING: 'uploading',
        PAUSED: 'paused',
        COMPLETED: 'completed',
        FAILED: 'failed',

    }
    //stores metadata about file uploads
    const files = new Map(); //key can be anything in a map

    // vv create html to contain the uploads
    const progressBox = document.createElement('div');
    progressBox.className = 'upload-progress-tracker';
    progressBox.innerHTML = `
        <h3>Upload</h3>
        <div class="file-progress-wrapper"></div>
    `;

    const fileProgressWrapper = progressBox.querySelector('.file-progress-wrapper');


    //vv create the html to represent individual upload entries
    const setFileElement = file => {
        const fileElement = document.createElement('div');
        fileElement.className = 'upload-progress-tracker';
        fileElement.innerHTML = `
            <div class="file-details">
                <p>
                <span class="file-name">${file.name}</span>
                <span class="file-status">${FILE_STATUS.PENDING}</span>
                <div class="progress-bar" style="width: 0; height: 2px; background-color: green"></div>
                <p>
            </div>
            <div class="file-actions">
                <button type="button" class="pause-button">Pause</button>
            </div>
        `;

        // CREATE A NEW MAP ENTRY see the "files" map above
        files.set(file, {
            status: FILE_STATUS.PENDING,
            size: file.size,
            percentage: 0,
            fileElement
        });

        //lets easily me grab the pause button even without an id signifier
        const [, {children: [pauseButton]}] = fileElement.children;

        pauseButton.addEventListener('click', () => uploader.abortFileUpload(file));

        fileProgressWrapper.appendChild(fileElement);
    }

    // vv update the html of an upload entry based on its status
    const updateFileElement = fileObj => {
        const [
            // in short: accessing the various nested children of "file-details" from the file DOM obj (fileObj) we send in, see setFileElement for structure
            {children: [{children: [fileName, fileStatus]}, progressBar]}] = fileObj.fileElement.children;

        requestAnimationFrame( () => {
            fileStatus.textContent = fileObj.status;
            fileStatus.className = `status ${fileObj.status}`;
            progressBar.style.width = fileObj.percentage + '%';

        })
    };

    // vv code for events during upload
    const onProgress = (e, file) => {
        const fileObj = files.get(file);

        fileObj.status = FILE_STATUS.UPLOADING;
        fileObj.percentage = e.loaded * 100 / e.total; //the loaded key indicates amount of bytes recieved, total is total bytes in file

        updateFileElement(fileObj);

        // console.log('-- progress');
    };

    const onError = (e, file) => {
        const fileObj = files.get(file);

        fileObj.status = FILE_STATUS.FAILED;
        fileObj.percentage = 100;

        updateFileElement(fileObj);

        // console.log('-- error');
    };

    const onAbort = (e, file) => {

        const fileObj = files.get(file);

        fileObj.status = FILE_STATUS.PAUSED;

        updateFileElement(fileObj);

        // console.log('-- abort');
    };

    const onComplete = (e, file) => {
        const fileObj = files.get(file);

        fileObj.status = FILE_STATUS.COMPLETED;

        updateFileElement(fileObj);

        // console.log('-- complete');
    };

    return (uploadedFiles) => {

        [...uploadedFiles].forEach(setFileElement); //for each upload, set some html

        uploader = uploadFiles(uploadedFiles, {
            path: "/",
            onComplete,
            onAbort,
            onError,
            onProgress
        });
        document.body.appendChild(progressBox);
    }
})();

const uploadButton = document.getElementById('upload-button');

uploadButton.addEventListener("change", (event) => {
    console.log('--event:',event.target.files);

    uploadAndTrackFiles(event.target.files);
});