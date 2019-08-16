const messages = require('./messages');
const controllers = require('./controllers');
const axios = require('axios');

const TelegramBot = require('node-telegram-bot-api');
const token = "739757471:AAE4U_spx1jGqAoeMMbKbPJGg9RExmX34VI";
const bot = new TelegramBot(token, {
    polling: true
});

bot.sendMessage(272562481, "Bot is now online!");

bot.onText(/Register new user/, async (msg) => {
    await bot.sendMessage(msg.chat.id, messages.askForUserIdMessage);
});

bot.onText(/\/start/, async (msg) => {
    await bot.sendMessage(msg.chat.id, messages.mainMenuMessage, messages.mainMenuKeyboard);
});

bot.onText(/To Main Menu/, async (msg) => {
    await bot.sendMessage(msg.chat.id, messages.mainMenuMessage, messages.mainMenuKeyboard);
});

bot.onText(/\/add (.+)/, async (msg, match) => {
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
   const namesArray = await controllers.fetchUsers(msg.chat.id);
   var namesStr = "Persons inside your watch list:\n";
   for(var i = 0; i < namesArray.length; i++) {
       namesStr += (namesArray[i] + "\n");
   }
   await bot.sendMessage(msg.chat.id, namesStr);
});

bot.onText(/Get statistics/, async (msg) => {
    await bot.sendMessage(msg.chat.id, messages.askForUserStatisticsMessage);
});

bot.onText(/\/remove (.+) (.+)/, async (msg, match) => {
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
    const resp = await axios.get("https://vk-online-bot.herokuapp.com/");
    console.log("Requesting server: ");
    //console.log(resp.data);
}, 120000);