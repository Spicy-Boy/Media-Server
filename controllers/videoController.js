const fs = require("fs");
const path = require("path");

// straight form chat gpt.. lets see if it works!
async function streamVideoTEST (req, res)
{
    let testPath = "../public/AARON_files/[Muhn Pace] Enies Lobby - 1.mp4"
    
    const videoPath = path.join(__dirname, testPath);
    // ^^ make this shit acquire the location of a file specified by its like code or something (query database if needed

    const videoSize = fs.statSync(videoPath).size;

    const range = req.headers.range;

    if (!range) {
        res.status(400).send("Requires Range header");
        return;
    }

    const CHUNK_SIZE = 10 ** 6; // 1MB
    const start = Number(range.replace(/\D/g, ""));
    const end = Math.min(start + CHUNK_SIZE, videoSize - 1);

    const contentLength = end - start + 1;

    const headers = {
        "Content-Range": `bytes ${start}-${end}/${videoSize}`,
        "Accept-Ranges": "bytes",
        "Content-Length": contentLength,
        "Content-Type": "video/mp4",
    };

    res.writeHead(206, headers);

    const videoStream = fs.createReadStream(videoPath, { start, end });

    videoStream.pipe(res);
}

module.exports = {
    streamVideoTEST
};