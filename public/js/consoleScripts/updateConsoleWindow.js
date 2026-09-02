//script with methods that can add messages to the console window
console.log('HI! LOADING updateConsoleWindow SCRIPT!');

const consoleWindow = document.getElementById('console-window');

const autoSnapConsoleCheckbox = document.getElementById('auto-snap-console-checkbox');
autoSnapConsoleCheckbox.checked = true

const autoGenerateThumbnailsCheckbox = document.getElementById('auto-generate-thumbnails-checkbox');
autoGenerateThumbnailsCheckbox.checked = true;

let snapToConsoleHeight = autoSnapConsoleCheckbox.checked;
let autoGenerateThumbnails = autoGenerateThumbnailsCheckbox.checked;

autoSnapConsoleCheckbox.addEventListener("change", () => {
    // console.log('CHECKED/UNCHECKED BOX!');
    // console.log('CHECKBOX: '+autoSnapConsoleCheckbox.checked+'');

    snapToConsoleHeight = autoSnapConsoleCheckbox.checked;
});

autoGenerateThumbnailsCheckbox.addEventListener("change", () => {
    autoGenerateThumbnails = autoGenerateThumbnailsCheckbox.checked;
});

async function addMessageToConsole(message)
{
    let newMessageDiv = document.createElement('div');
    newMessageDiv.classList.add("console-entry");
    newMessageDiv.innerText = message;
    consoleWindow.appendChild(newMessageDiv);


    //snap to latest messages
    if (snapToConsoleHeight)
    {
        consoleWindow.scrollTop = consoleWindow.scrollHeight;
    }

}