const argon2 = require('argon2');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question("Enter a password: ", (name) => {

    console.log('Generating argon2 password..');
    createArgon2Password(name);
    rl.close();
    
});

async function createArgon2Password (passwordPlain)
{

    const encryptedPassword = await argon2.hash(passwordPlain);
    console.log("Encrypted password:",encryptedPassword);
    // return encryptedPassword;

}