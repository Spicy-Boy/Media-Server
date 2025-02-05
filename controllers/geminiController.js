require('dotenv').config();

async function callGeminiAPI(req, res)
{
    try 
    {
        apiKey = process.env.GEMINI_API_KEY;

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "prompt": {
                    "text": req.body.userQuery
                }
            })
        });

        const data = await response.json();
        console.log(data);

        return data;
    }
    catch (error)
    {
        return "Something went wrong! Please try again later.."
    }
}

module.exports = {
    callGeminiAPI
};