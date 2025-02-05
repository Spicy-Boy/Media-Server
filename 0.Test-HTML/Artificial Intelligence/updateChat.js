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
        // waiting = true; //lock user out of submitting queries

        const newMessageDiv = document.createElement('div');
        newMessageDiv.textContent = textBox.value;
        newMessageDiv.classList.add("user-submission");
        
        messageBox.appendChild(newMessageDiv);
        // vv ensures scrollbox snaps to new messages when submitted
        messageBox.scrollTop = messageBox.scrollHeight;

        textBox.value = "";

        waiting = true;

        //the robot message is the response from AI
        const newRobotMessageDiv = document.createElement("div");
        newRobotMessageDiv.textContent = "🖥️: ...";
        messageBox.appendChild(newRobotMessageDiv);

        //vv while waiting for the server to come up with an answer to the user's query, show a loading animation!
        intervalId = setInterval(() => {
        animateRobotThinking(newRobotMessageDiv)}, 600);
        
        // // //TEST vvv Without an api plugged in
        // setTimeout(() => {
        //     waiting = false;
        // // :D
        //     newRobotMessageDiv.textContent = "🖥️: shut up idiot";
        // }, 5000);

    }
});

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

