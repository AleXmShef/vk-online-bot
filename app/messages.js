const mainMenuKeyboard = {
    "reply_markup": {
        "keyboard": [["Register new user", "Delete existing user"], ["Get statistics"]],
        "one_time_keyboard": false
    }};

const mainMenuMessage = "Choose action";
const askForUserIdMessage = "Please enter /addUser {User ID from vk.com}";

const successfulUserRegistrationMessage = "Successfully registered new user!";

const errorUserRegistrationMessage = "Unable to register new user: invalid User ID.";

const isOnlineMessage = (name) => {return name + " is online!"};

module.exports = {
    mainMenuKeyboard,
    mainMenuMessage,
    askForUserIdMessage,
    successfulUserRegistrationMessage,
    errorUserRegistrationMessage,
    isOnlineMessage
};