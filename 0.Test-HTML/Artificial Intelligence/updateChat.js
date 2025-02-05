// begin by getting the DOM elements for the submit button, the textbox, and the container for messages

console.log("hi");

let waiting = false; //prevents spamming button :)

const messageBox = document.getElementById('responses-and-submissions-container');

const textBox = document.getElementById('content');

const submitButton = document.getElementById('submitQueryButton');
submitButton.addEventListener("click", (e) => {
    if (!waiting && textBox.textContent != null)
        {
            console.log('hi!!');
            const newMessageDiv = document.createElement('div');
            newMessageDiv.textContent = textBox.value;
            newMessageDiv.classList.add("user-submission");
            
            messageBox.appendChild(newMessageDiv);
            // vv ensures scrollbox snaps to new messages when submitted
            messageBox.scrollTop = messageBox.scrollHeight;

            textBox.value = "";
        }
});

