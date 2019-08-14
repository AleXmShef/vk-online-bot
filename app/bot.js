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

bot.onText(/Reset database/, async (msg) => {
   //TODO: notify all users
    await controllers.resetDatabase(msg.from.id);
});

bot.onText(/\/start/, async (msg) => {
    await bot.sendMessage(msg.chat.id, messages.mainMenuMessage, messages.mainMenuKeyboard);
});

bot.onText(/To Main Menu/, async (msg) => {
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

bot.onText(/Delete existing user/, async (msg) => {
    await bot.sendMessage(msg.chat.id, messages.askForUserCredentialsMessage);
});

bot.onText(/View users/, async (msg) => {
   const namesArray = controllers.fetchUsers(msg.chat.id);
   var namesStr = "Your registered users:\n";
   for(var i = 0; i < namesArray.length; i++) {
       namesStr += namesArray[i];
   }
   await bot.sendMessage(msg.chat.id, namesStr);
});

bot.onText(/Get statistics/, async (msg) => {
    await bot.sendMessage(msg.chat.id, messages.askForUserStatisticsMessage);
});

bot.onText(/\/removeUser (.+) (.+)/, async (msg, match) => {
   const first_name = match[1];
   const last_name = match[2];
   await controllers.deleteExistingUser(msg.from.id, first_name, last_name);
   await bot.sendMessage(msg.chat.id, messages.successfulUserRemovalMessage);
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