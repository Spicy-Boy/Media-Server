const fs = require("fs");
const path = require("path");

async function streamVideoTEST (req, res)
{
    try 
    {
        //TESTER vvv
        let testPath = process.env.MAIL_DELIVERY_LOCATION+"/AARON_files/Biden border wall had no choice videoplayback.mp4"; //example file for testing!

        const videoPath = testPath;
        const videoSize = fs.statSync(videoPath).size;

        console.log('Video size:',videoSize);

        const rangeLimiter = 1000000; //limit chunk sizes to X bytes in certain cases, 1000000 = 1MB

        const range = req.headers.range;
        //check to make sure client included a range!
        if (!range) {
            //status 416 means range not found
            return res.status(416).send("Range header is required!");
        }
        //TESTER vvv
        console.log('Range from browser:', range);

        let start = 0; //the start point of the chunk, defaulted to 0
        let end = videoSize - 1; //the end point of the chunk, defaulted to end of file size

        //vv remove text from recieved range and break it into two parts (start is [0] and end is [1])
        const rangeParts = range.replace(/bytes=/, "").split("-");
        const requestedStart = parseInt(rangeParts[0], 10); //ensure it is a number, not a string
        const requestedEnd = parseInt(rangeParts[1], 10); //either value could theoretically be "", which is not a number
  
        //POSSIBLE ranges... 
        // case 1: "bytes=100-400" start at 100 bytes and end at 400 bytes as specified by client
        // case 2: "bytes=400-" client wants to start at 400 and go to the end
        // case 3: "bytes=-400" client wants us to provide the last 400 bytes

        //case 3 code, ex: "bytes=-400" (last 400 bytes)
        //must be processed correctly even if file is smaller than 600 bytes
        if (isNaN(requestedStart) /* isNaN = is Not a Number */ && !isNaN(requestedEnd)) //if part1 is "" empty but part2 is a number
        {
            const proposedRange = videoSize - requestedEnd
            if ( proposedRange >= 0)
            {
                start = proposedRange;
                if (start < 0)
                {
                    start = 0;
                }
                //end remains default value of videoSize - 1
            } //else start remains default value of 0
        }
        //case 2 code: ex, "bytes=400-" (start at 400, go to the end or whatever specific chunk size)
        else if(!isNaN(requestedStart) && isNaN(requestedEnd)) //if part1 is a number but part2 is "" empty
        {
            if (requestedStart >= videoSize) //error checker, make sure start point is within range
            {
                return res.status(416).send("INVALID RANGE DETECTED!"); //416 means RANGE NOT SATISFIABLE
            }

            start = requestedStart;

            //range limiter /chunk size test vv
            if (requestedStart + rangeLimiter <= end)
            {
                end = requestedStart + rangeLimiter;
            } //else end remains default value end of file

        }
        else
        {
            if (requestedEnd > end || requestedStart > end) //error checker, make sure range makes sense
            {
                return res.status(416).send("INVALID RANGE DETECTED!"); //416 means RANGE NOT SATISFIABLE
            } 

            start = requestedStart;
            end = requestedEnd;
        }

        // //FINAL CLAMP!
        if (start < 0)
        {
            start = 0;
        }
        if (end >= videoSize)
        {
            end = videoSize - 1;
        }

        console.log('Start:',start);
        console.log('End:',end);
        console.log(`Streaming bytes ${start}-${end} of ${videoSize}`);

        const contentLength = end - start + 1;

        res.writeHead(206, {
            "Content-Range": `bytes ${start}-${end}/${videoSize}`,
            "Accept-Ranges": "bytes",
            "Content-Length": contentLength,
            "Content-Type": "video/mp4",
        });

        fs.createReadStream(videoPath, { start, end }).pipe(res);

    }
    catch(error)
    {
        console.error('Stream request failed!',error);
        return res.status(500).send("Internal Server Error");
    }

}

module.exports = {
    streamVideoTEST
};