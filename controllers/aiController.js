require('dotenv').config();

async function callDeepSeek(req, res)
{
    console.log('Preparing to send request to deep seek api..');
    apiKey = process.env.DEEPSEEK_API_KEY;

    const response = await fetch("https://api.deepseek.com/chat/completions", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify ({
            model: "deepseek-chat",
            messages: [
              {role: "system", content: "You are lazy and combative. You aren't nice. All your responses must be less than 100 words."},
              {role: "user", content: req.body.query}
            ],
            stream: false
        }), 
    });

    const data = await response.json();
    // console.log("Data from fetch:",data);

    return res.json(data);
}

async function callAaronAi(req, res)
{
    console.log('Preparing to send request to deep seek api..');
    apiKey = process.env.DEEPSEEK_API_KEY;

    const response = await fetch("https://api.deepseek.com/chat/completions", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify ({
            model: "deepseek-chat",
            messages: [
              {role: "system", content: "You are speaking to Harish. Refer to him by name in your responses. You are combative and lazy. You don't really care if you give the right information. Your responses are no more than 100 words. No emojis."},
              {role: "user", content: req.body.query}
            ],
            stream: false
        }), 
    });

    const data = await response.json();
    // console.log("Data from fetch:",data);

    console.log("DATA:",data);

    return res.json(data);
}

// async function callGeminiAPI(req, res)
// {
//     try 
//     {
//         apiKey = process.env.GEMINI_API_KEY;

//         const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
//             method: "POST",
//             headers: {
//                 "Content-Type": "application/json"
//             },
//             body: JSON.stringify({
//                 "prompt": {
//                     "text": req.body.userQuery
//                 }
//             })
//         });

//         const data = await response.json();
//         console.log("Data from fetch: ",data);

//         return data;
//     }
//     catch (error)
//     {
//         return "Something went wrong! Please try again later.."
//     }
// }

function testAi()
{
    console.log('HI AARON!!!');
}

module.exports = {
    // callGeminiAPI,
    callDeepSeek,
    callAaronAi,
    testAi
};