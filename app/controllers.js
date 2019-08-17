const services = require('./services');
const User = require('./User');
const adminChatID = "272562481";

async function registerNewUser(curUser, targetUserLink) {

    const userID = await services.getUserID(targetUserLink);
    if(!userID) {
        return 0;
    }

    const vkUser = await services.getUserData(userID);
    console.log("registering new user: ");
    console.log(vkUser);

    const curUserString = curUser.toString();
    let alreadyExists = await User.findOne({userid: curUserString});
    if(!alreadyExists) {
        let online_data = [];
        online_data.push({time: Date.now(), is_online: vkUser.online});
        let spectated = [];
        spectated.push({userid: vkUser.id, first_name: vkUser.first_name, last_name: vkUser.last_name, online_data: online_data});
        const user = new User({userid: curUserString, spectatedArray: spectated});
        await user.save();
    }
    else {
        let alreadyExists2 = 0;
        for(let i = 0; i < alreadyExists.spectatedArray.length; i++) {
            if(alreadyExists.spectatedArray[i].userid === vkUser.id)
                alreadyExists2 = 1;
        }
        if(!alreadyExists2) {
            let online_data = [];
            online_data.push({time: Date.now(), is_online: vkUser.online});
            alreadyExists.spectatedArray.push({userid: vkUser.id, first_name: vkUser.first_name, last_name: vkUser.last_name, online_data: online_data});
            await alreadyExists.save();
        }
    }
}

async function deleteExistingUser(userID, first_name, last_name) {
    console.log("deleting user: " + first_name + " " + last_name);
    const user = await User.findOne({userid: userID.toString()});
    for(let i = 0; i < user.spectatedArray.length; i++) {
        if (user.spectatedArray[i].first_name === first_name && user.spectatedArray[i].last_name === last_name) {
            user.spectatedArray[i].splice(i, 1);
            await user.save();
            break;
        }
    }
}

async function checkForUpdates(callback) {
    const users = await User.find();
    for(let i = 0; i < users.length; i++) {
        for(let j = 0; j < users[i].spectatedArray.length; j++) {
            const user = users[i].spectatedArray[j];
            const vkUser = await services.getUserData(user.userid);
            if (user.online_data[user.online_data.length - 1].is_online !== vkUser.online) {
                user.online_data.push({'time': Date.now(), 'is_online': vkUser.online});
                if (vkUser.online) {
                    console.log("Sending online notification, user online: " + vkUser.first_name + " " + vkUser.last_name);
                    await callback(users[i].userid, vkUser.first_name + " " + vkUser.last_name);
                }
            }
            users[i].spectatedArray[j] = user;
            users[i].save();
        }
    }
}

async function fetchUsers(chatID) {
    console.log("fetching users");
    let namesArray = [];
    const stringChatID = chatID.toString();
    const user = await User.findOne({userid: stringChatID});
    for(let i = 0; i < user.spectatedArray.length; i++) {
        namesArray.push(user.spectatedArray[i].first_name.toString() + " " + user.spectatedArray[i].last_name.toString());
    }
    return namesArray;
}

module.exports = {
    registerNewUser,
    checkForUpdates,
    deleteExistingUser,
    fetchUsers,
};