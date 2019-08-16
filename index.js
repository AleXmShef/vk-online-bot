require('./app/bot.js');
const http = require("http");
const PORT = process.env.PORT;
const mongoose = require('mongoose');
const connectDB = async () => {
    try {
        await mongoose.connect("mongodb+srv://admin:Gjkbwbz13@cluster0-3grlu.mongodb.net/test?retryWrites=true&w=majority", {
            useNewUrlParser: true,
            useCreateIndex: true,
            useFindAndModify: false
        });

        console.log('MongoDB connected...');
    } catch(err) {
        console.error(err.message);
        process.exit(1);
    }
};

connectDB();

http.createServer((req, res) => {
    console.log("response from server");
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Blank page\n Visit @VkOnlineNotificationBot in Telegram to use this service');
}).listen(PORT);

