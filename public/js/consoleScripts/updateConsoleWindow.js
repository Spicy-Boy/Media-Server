//script with methods that can add messages to the console window
console.log('HI! LOADED updateConsoleWindow SCRIPT!');

const consoleWindow = document.getElementById('console-window');

const autoSnapConsoleCheckbox = document.getElementById('auto-snap-console-checkbox');
autoSnapConsoleCheckbox.checked = true

let snapToConsoleHeight = autoSnapConsoleCheckbox.checked;

async function addMessageToConsole(message)
{
    
    //snap to latest messages
    if (snapToConsoleHeight)
    {
        consoleWindow.scrollTop = consoleWindow.scrollHeight;
    }

}