require('./app/bot.js');
const http = require("http");
const PORT = process.env.PORT;

http.createServer((req, res) => {
    console.log("response from server");
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Blank page\n Visit @VkOnlineNotificationBot in Telegram to use this service');
}).listen(PORT);

