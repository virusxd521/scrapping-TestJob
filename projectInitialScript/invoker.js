require('dotenv').config();
const { exec } = require('child_process');
const prompt = require('prompt');
prompt.start();

const promptAsking = "Please enter the name of the item that you are looking for";

prompt.get([promptAsking], (err, result) => {
    if (err) {
        return onErr(err);
    }
    process.env.USER_ITEM = result[promptAsking];
});

exec("npm start", (error, stdout, stderr) => {
    if(error){
        console.log(error);
    } else {
        console.log(stdout);
    }
});

// prompt.stop();

