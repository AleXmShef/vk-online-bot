const services = require('./services');
const User = require('./User');
const adminChatID = "272562481";

async function registerNewUser(curUser, targetUserLink) {
    const userID = await services.getUserID(targetUserLink);
    if(!userID) {
        console.log("throwing error");
        throw {message: "No user"};
    }

    const vkUser = await services.getUserData(userID);
    if(!vkUser || typeof vkUser === "undefined") {
        console.log("throwing error");
        throw {message: "No user"};
    }
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
        if(alreadyExists2 === 1) {
            console.log("throwing error");
            throw {message: "User already exists"};
        }
        let online_data = [];
        online_data.push({time: Date.now(), is_online: vkUser.online});
        alreadyExists.spectatedArray.push({userid: vkUser.id, first_name: vkUser.first_name, last_name: vkUser.last_name, online_data: online_data});
        await alreadyExists.save();
    }
}

async function deleteExistingUser(userID, first_name, last_name) {
    console.log("deleting user: " + first_name + " " + last_name);
    const user = await User.findOne({userid: userID.toString()});
    if(!user) {
        throw {message: 'No user'};
    }
    let success = 0;
    for(let i = 0; i < user.spectatedArray.length; i++) {
        if (user.spectatedArray[i].first_name === first_name && user.spectatedArray[i].last_name === last_name) {
            user.spectatedArray.splice(i, 1);
            await user.save();
            success = 1;
            break;
        }
    }
    if(!success) {
        console.log("throwing error");
        throw {message: 'No user'};
    }
}

async function sleep(ms){
    return new Promise(resolve=>{
        setTimeout(resolve,ms)
    })
}

async function checkForUpdates(callback) {
    const beginTime = Date.now();
    const users = await User.find();
    for(let i = 0; i < users.length; i++) {
        for(let j = 0; j < users[i].spectatedArray.length; j++) {
            const user = users[i].spectatedArray[j];
            const vkUser = await services.getUserData(user.userid);
            if(!vkUser) {
                throw {message: 'No user', spectator: users[i].userid, spectatedName: users[i].spectatedArray[j].first_name + " "
                    + users[i].spectatedArray[j].last_name};
            }
            if (user.online_data.length > 5) {
                user.online_data = await user.online_data.slice(user.online_data.length - 2);
            }
            if (user.online_data[user.online_data.length - 1].is_online !== vkUser.online) {
                await user.online_data.push({'time': Date.now(), 'is_online': vkUser.online});
                if (vkUser.online) {
                    console.log("Sending online notification, user online: " + vkUser.first_name + " " + vkUser.last_name);
                    await callback(users[i].userid, vkUser.first_name + " " + vkUser.last_name);
                }
            }
            users[i].spectatedArray[j] = user;
            //console.log(user2);
            await sleep(300);
        }
        await User.updateOne({userid: users[i].userid}, {spectatedArray: users[i].spectatedArray});
        const user2 = await User.findOne({userid: users[i].userid});
        if (JSON.stringify(users[i]) !== JSON.stringify(user2)) {
            console.log(`Error saving database, failed user: ${user2.userid}`);
        }
    }
    const endTime = Date.now();
    const deltaTime = endTime - beginTime;
    console.log(`deltaTime = ${deltaTime}`);
    await callback(0, 0, deltaTime);
}

async function fetchUsers(chatID) {
    console.log("fetching users");
    let namesArray = [];
    const stringChatID = chatID.toString();
    const user = await User.findOne({userid: stringChatID});
    if(!user) {
        throw {message: 'No user'};
    }
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