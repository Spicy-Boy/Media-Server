//takes a number of bytes and converts to a string with file size marker (ex 6.23 gb)
function calculateFileSize(bytes)
{
    if (bytes >= 1073741824) //1 gb = 1073741824 bytes
    {
        return (bytes / 1073741824).toFixed(2) + " GB";
    }
    else if (bytes >= 1048576) //1 mb in bytes
    {
        return (bytes / 1048576).toFixed(2) + " MB";
    }
    else if (bytes >= 1024) //1 kb in bytes
    { 
        bytes = (bytes / 1024).toFixed(2) + " KB"; 
    }
    else if (bytes > 1)
    { 
        bytes = bytes + " bytes"; 
    }
    else if (bytes == 1)
    { 
        bytes = bytes + " byte"; 
    }
    else {
        return "???";
    }
}