require('./app/bot.js')
const http = require("http");
const PORT = process.env.port;

http.createServer((req, res) => {
    console.log("response from server");
}).listen(PORT);

