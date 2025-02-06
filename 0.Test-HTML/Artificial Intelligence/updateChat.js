// begin by getting the DOM elements for the submit button, the textbox, and the container for messages

console.log("hi");

let waiting = false; //prevents spamming button :)
let intervalId;

const messageBox = document.getElementById('responses-and-submissions-container');

const textBox = document.getElementById('content');

const submitButton = document.getElementById('submitQueryButton');
submitButton.addEventListener("click", (e) => {
    
    if (!waiting && textBox.textContent != null)
    {
        const newMessageDiv = document.createElement('div');
        newMessageDiv.textContent = textBox.value;
        newMessageDiv.classList.add("user-submission");
        
        messageBox.appendChild(newMessageDiv);


        let userQuery = textBox.value;
        textBox.value = "";

        waiting = true; //lock user out of submitting queries

        //the robot message is the response from AI
        const newRobotMessageDiv = document.createElement("div");
        newRobotMessageDiv.textContent = "🖥️: ...";
        newRobotMessageDiv.classList.add("ai-response");
        messageBox.appendChild(newRobotMessageDiv);

        //vv while waiting for the server to come up with an answer to the user's query, show a loading animation!
        intervalId = setInterval(() => {
        animateRobotThinking(newRobotMessageDiv)}, 600);

        callAPI(userQuery, newRobotMessageDiv, messageBox);
        // vv ensures scrollbox snaps to new messages when submitted
        
        
        // // //TEST vvv Without an api plugged in
        // setTimeout(() => {
        //     waiting = false;
        // // :D
        //     newRobotMessageDiv.textContent = "🖥️: shut up idiot";
        // }, 5000);

    }
});

async function callAPI(userQuery, newRobotMessageDiv, messageBox)
{
    const robotMsgStart = "🖥️: "

     console.log('User submitted: ',userQuery);

    const apiKey = "";

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
              {role: "user", content: userQuery}
            ],
            stream: false
        }), 
    });

    const data = await response.json();
    console.log('API Response: ', data);

    waiting = false;
    newRobotMessageDiv.textContent = robotMsgStart +""+ (data.choices[0].message.content || "Error getting response... try again later!");
    messageBox.scrollTop = messageBox.scrollHeight;
}

    // //supposedly gemini structure vvv not sure LMAO
    // const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
    //     method: "POST",
    //     headers: {
    //         "Content-Type": "application/json"
    //     },
    //     body: JSON.stringify({
    //         "prompt": {
    //             "text": userQuery
    //         }
    //     })
    // });

let frameIndex = 0;
const loadingFrames = ["🖥️: o..", "🖥️: .o.", "🖥️: ..o", "🖥️: ..."];


function animateRobotThinking(newRobotMessageDiv)
{
    
    if (!waiting)
    {
        clearInterval(intervalId); //stops the animation cold
        intervalId = null;
        return;
    }

    //tester vv
    // console.log('new frame, ',frameIndex, newRobotMessageDiv.textContent);

    newRobotMessageDiv.textContent = loadingFrames[frameIndex];
    frameIndex++;
    if (frameIndex > 3)
    {
        frameIndex = 0;
    }

}

