const messages = require('./messages');
const controllers = require('./controllers');

const TelegramBot = require('node-telegram-bot-api');
const token = "739757471:AAE4U_spx1jGqAoeMMbKbPJGg9RExmX34VI";
const bot = new TelegramBot(token, {
    polling: true
});

bot.onText(/Register new user/, async (msg) => {
    await bot.sendMessage(msg.chat.id, messages.askForUserIdMessage);
});

bot.onText(/\/start/, async (msg) => {
    await bot.sendMessage(msg.chat.id, messages.mainMenuMessage, messages.mainMenuKeyboard);
});

bot.onText(/\/addUser (.+)/, async (msg, match) => {
    userID = match[1];
    if (!controllers.registerNewUser(msg.chat.id, userID)) {
        await bot.sendMessage(msg.chat.id, messages.errorUserRegistrationMessage);
        return -1;
    }
    await bot.sendMessage(msg.chat.id, messages.successfulUserRegistrationMessage);
});

setInterval(async () => {
    await controllers.checkForUpdates(onlineNotification);
}, 5000);

const onlineNotification = async (chatID, userName) => {
    await bot.sendMessage(chatID, messages.isOnlineMessage(userName));
};

setInterval(async () => {
    await controllers.saveDatabase();
}, 60000);