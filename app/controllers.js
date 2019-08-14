const services = require('./services');
const fs = require('fs');
const adminChatID = "272562481";


var Database;

async function readDatabase() {
    console.log("Recreating databasae:");
    if(fs.existsSync('database.json')) {
        const jsonDatabase = await fs.readFileSync('database.json', 'utf8', (err, data) => {
            return data;
        });
        const iterableDatabase = JSON.parse(jsonDatabase);
        console.log(jsonDatabase);
        Database = new Map([iterableDatabase]);
        console.log("Database:");
        console.log(Database);
    }
    else {
        Database = new Map();
    }
}

if(!Database) {
    readDatabase();
}

async function saveDatabase() {
    if (Database.size > 0) {
        const jsonDatabase = await JSON.stringify(...Database);
        await fs.writeFile('database.json', jsonDatabase);
        console.log("Saved database");
    }
}

async function resetDatabase(userID) {
    if(userID.toString() === adminChatID) {
        fs.unlinkSync('database.json');
        await readDatabase();
    }
}

async function registerNewUser(curUser, targetUserLink) {

    const userID = await services.getUserID(targetUserLink);
    if(!userID) {
        return 0;
    }

    const user = await services.getUserData(userID);
    console.log(user);

    const curUserString = curUser.toString();
    if(!Database.get(curUserString)) {
        Database.set(curUserString, []);
    }
    var alreadyExists = 0;
    var i;
    for(i = 0; i < Database.get(curUserString).length; i++) {
        if(Database.get(curUserString)[i]['userid'] === user.id)
            alreadyExists = 1;
    }
    console.log(alreadyExists);
    if(!alreadyExists) {
        Database.get(curUserString).push(
            {
                'userid': user.id,
                'first_name': user.first_name,
                'last_name': user.last_name,
                'online_data': [{
                    'time': Date.now(),
                    'is_online': user.online
                }]
            });
        await saveDatabase();
    }
}

async function deleteExistingUser(userID, first_name, last_name) {
    for(var i = 0; i < Database.get(userID.toString()).length; i++) {
        if (Database.get(userID.toString())[i].first_name === first_name && Database.get(userID.toString())[i].last_name === last_name) {
            Database.get(userID.toString()).splice(i, 1);
            break;
        }
    }
}

async function checkForUpdates(callback) {
    await Database.forEach(async (value, key, map) => {
        var i;
        for(i = 0; i < Database.get(key).length; i++) {
            //console.log("fetching user data");
            const user = await services.getUserData(Database.get(key)[i].userid);
            if(Database.get(key)[i].online_data[Database.get(key)[i].online_data.length - 1].is_online !== user.online) {
                Database.get(key)[i].online_data.push({'time': Date.now(), 'is_online': user.online});
                if(user.online) {
                    console.log("sending online notification");
                    await callback(key, user.first_name + " " + user.last_name);
                }
            }
        }
    })
}

function fetchUsers(chatID) {
    var namesArray = new Array();
    const stringChatID = chatID.toString();
    console.log(stringChatID);
    for(var i = 0; i < Database.get(stringChatID).length; i++) {
        namesArray.push(Database.get(stringChatID)[i].first_name + " " + Database.get(stringChatID)[i].last_name);
    }
    return namesArray;
}

module.exports = {
    registerNewUser,
    checkForUpdates,
    saveDatabase,
    deleteExistingUser,
    fetchUsers,
    resetDatabase
};