async function callDeepSeek()
{
    let userQuery = "How do I make a flan?"

    try {
        const response = await fetch("http://localhost:8080/api/ai/callAaronAi", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ query: userQuery })
        });

        const data = await response.json();

        console.log('API Response: ', data.choices?.[0]?.message);
    }
    catch (error)
    {
        console.log(error);
    }
}

console.log('STARTING CALL TEST!');
callDeepSeek();