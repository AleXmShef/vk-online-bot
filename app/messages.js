const mainMenuKeyboard = {
    "reply_markup": {
        "keyboard": [["Add new person", "Remove person"], ["View statistics"], ["View your persons"]],
        "one_time_keyboard": false
    }};

const mainMenuMessage = "Choose action";

const askForUserIdMessage = "Please enter \n /add {person's user ID from vk.com}";

const askForUserCredentialsMessage = "Please enter \n /remove {person's name} {person's surname}";

const successfulUserRegistrationMessage = "Successfully added new person to the watch list!";

const errorUserRegistrationMessage = "Unable to add new user: \n Invalid user ID";

const successfulUserRemovalMessage = "Successfully removed existing person from your watch list";

const askForUserStatisticsMessage = "Not implemented yet";

const goToMainMEnuMessage = "To Main Menu";

const noUsersInWatchListMessage = "Currently you don't have any users inside your watch list :(";

const noUserToDeleteMessage = "There is no user with this name inside your watch list";

const incorrectCommandMessage = "Incorrect command, please check your spelling";

const userAlreadyInTheWatchListMessage = "You already have this person inside your watch list!";

const isOnlineMessage = (name) => {return name + " is now online!"};

const genericErrorMessage = "Unexpected error, please try again with something different";

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
    noUserToDeleteMessage,
    noUsersInWatchListMessage,
    incorrectCommandMessage,
    userAlreadyInTheWatchListMessage,
    genericErrorMessage,
    isOnlineMessage
};