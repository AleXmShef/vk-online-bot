const mainMenuKeyboard = {
    "reply_markup": {
        "keyboard": [["Register new user", "Delete existing user"], ["Get statistics"], ["View users"]],
        "one_time_keyboard": false
    }};

const mainMenuMessage = "Choose action";

const askForUserIdMessage = "Please enter /addUser {User ID from vk.com}";

const askForUserCredentialsMessage = "Please enter /removeUser {Name Surname}";

const successfulUserRegistrationMessage = "Successfully registered new user!";

const errorUserRegistrationMessage = "Unable to register new user: invalid User ID.";

const successfulUserRemovalMessage = "Successfully removed existing user";

const askForUserStatisticsMessage = "Not implemented yet";

const goToMainMEnuMessage = "To Main Menu";

const isOnlineMessage = (name) => {return name + " is now online!"};

module.exports = {
    mainMenuKeyboard,
    askForUserCredentialsMessage,
    mainMenuMessage,
    askForUserIdMessage,
    successfulUserRegistrationMessage,
    errorUserRegistrationMessage,
    successfulUserRemovalMessage,
    goToMainMEnuMessage,
    askForUserStatisticsMessage,
    isOnlineMessage
};