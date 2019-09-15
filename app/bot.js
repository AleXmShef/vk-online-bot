const messages = require('./messages');
const controllers = require('./controllers');
const axios = require('axios');

const TelegramBot = require('node-telegram-bot-api');
const token = "739757471:AAE4U_spx1jGqAoeMMbKbPJGg9RExmX34VI";
const bot = new TelegramBot(token, {
    polling: true
});

bot.sendMessage(272562481, "Bot is now online!", messages.mainMenuKeyboard);

bot.onText(/Add new person/, async (msg) => {
    await bot.sendMessage(msg.chat.id, messages.askForUserIdMessage);
});

bot.onText(/Remove person/, async (msg) => {
    await bot.sendMessage(msg.chat.id, messages.askForUserCredentialsMessage);
});

bot.onText(/View your persons/, async (msg) => {
    try {
        const namesArray = await controllers.fetchUsers(msg.chat.id);
        if(!namesArray) {
            await bot.sendMessage(msg.chat.id, messages.noUsersInWatchListMessage);
            return -1;
        }
        let namesStr = "Persons inside your watch list:\n";
        for(let i = 0; i < namesArray.length; i++) {
            namesStr += (namesArray[i] + "\n");
        }
        await bot.sendMessage(msg.chat.id, namesStr);
    } catch(err) {
        if(err.message === 'No user')
            await bot.sendMessage(msg.chat.id, messages.noUsersInWatchListMessage);
        else
            await bot.sendMessage(msg.chat.id, messages.genericErrorMessage);
    }
});

bot.onText(/View statistics/, async (msg) => {
    await bot.sendMessage(msg.chat.id, messages.askForUserStatisticsMessage);
});

bot.onText(/\/statistics/, async (msg) => {
    await bot.sendMessage(msg.chat.id, messages.askForUserStatisticsMessage);
});


bot.onText(/To Main Menu/, async (msg) => {
    await bot.sendMessage(msg.chat.id, messages.mainMenuMessage, messages.mainMenuKeyboard);
});

bot.onText(/\/start/, async (msg) => {
    await bot.sendMessage(msg.chat.id, messages.mainMenuMessage, messages.mainMenuKeyboard);
});

bot.onText(/\/add (.+)/, async (msg, match) => {
    userID = match[1];
    try {
        await controllers.registerNewUser(msg.chat.id, userID);
        await bot.sendMessage(msg.chat.id, messages.successfulUserRegistrationMessage);
    } catch (err) {
        if(err.message === "No user") {
            console.log(err.message);
            await bot.sendMessage(msg.chat.id, messages.errorUserRegistrationMessage);
        }
        else if (err.message === "User already exists") {
            await bot.sendMessage(msg.chat.id, messages.userAlreadyInTheWatchListMessage);
        }
        else
            await bot.sendMessage(msg.chat.id, messages.genericErrorMessage);
    }
});

bot.onText(/\/view/, async (msg) => {
    try {
        const namesArray = await controllers.fetchUsers(msg.chat.id);
        if(!namesArray) {
            await bot.sendMessage(msg.chat.id, messages.noUsersInWatchListMessage);
            return -1;
        }
        let namesStr = "Persons inside your watch list:\n";
        for(let i = 0; i < namesArray.length; i++) {
            namesStr += (namesArray[i] + "\n");
        }
        await bot.sendMessage(msg.chat.id, namesStr);
    } catch(err) {
        if(err.message === 'No user')
            await bot.sendMessage(msg.chat.id, messages.noUsersInWatchListMessage);
        else
            await bot.sendMessage(msg.chat.id, messages.genericErrorMessage);
    }
});

bot.onText(/\/remove (.+) (.+)/, async (msg, match) => {
   const first_name = match[1];
   const last_name = match[2];
   try {
       await controllers.deleteExistingUser(msg.from.id, first_name, last_name);
       await bot.sendMessage(msg.chat.id, messages.successfulUserRemovalMessage);
   } catch(err) {
       if(err.message === 'No user')
           await bot.sendMessage(msg.chat.id, messages.noUserToDeleteMessage);
       else
           await bot.sendMessage(msg.chat.id, messages.genericErrorMessage);
   }
});

setInterval(async () => {
    try {
        await controllers.checkForUpdates(onlineNotification);
    } catch (err) {
        if (err.message === 'No user') {
            //do something
        }
    }
}, 5000);

const onlineNotification = async (chatID, userName) => {
    await bot.sendMessage(chatID, messages.isOnlineMessage(userName));
};

setInterval(async () => {
    const resp = await axios.get("https://vk-online-bot.herokuapp.com/");
    console.log("requesting server for anti shutdown by heroku");
    //console.log(resp.data);
}, 120000);