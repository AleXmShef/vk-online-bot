require('./app/bot.js')
const http = require("http");
const PORT = process.env.PORT;

http.createServer((req, res) => {
    console.log("response from server");
}).listen(PORT);

