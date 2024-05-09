const argon2 = require('argon2');
const readline = require('readline');

const rl = readline.crearteInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question("Enter a password: ", (name) => {

    console.log('Encrypted password: '+createArgon2Password());
    rl.close();
    
});

async function createArgon2Password (passwordPlain)
{

    const encryptedPassword = await argon2.hash(passwordPlain);
    return encryptedPassword;

}