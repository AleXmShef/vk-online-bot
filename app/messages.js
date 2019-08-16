const mainMenuKeyboard = {
    "reply_markup": {
        "keyboard": [["Add new person", "Delete existing person"], ["Get statistics"], ["View your persons"]],
        "one_time_keyboard": false
    }};

const mainMenuMessage = "Choose action";

const askForUserIdMessage = "Please enter /add {Person's ID from vk.com}";

const askForUserCredentialsMessage = "Please enter /remove {Person's Name} {Person's Surname}";

const successfulUserRegistrationMessage = "Successfully added new person to the watch list!";

const errorUserRegistrationMessage = "Unable to register new user: invalid 'Person's VK User ID.'";

const successfulUserRemovalMessage = "Successfully removed existing person from the watch list";

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