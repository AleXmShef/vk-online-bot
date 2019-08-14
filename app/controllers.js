const services = require('./services');
const fs = require('fs');

var Database;
if(!Database) {
    console.log("Recreating databasae:");
    if(fs.existsSync('database.json')) {
        const jsonDatabase = fs.readFileSync('database.json', 'utf8', (err, data) => {
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

async function saveDatabase() {
    const jsonDatabase = await JSON.stringify(...Database);
    await fs.writeFile('database.json', jsonDatabase);
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

async function deleteExistingUser(userName) {

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

module.exports = {
    registerNewUser,
    checkForUpdates,
    saveDatabase,
    deleteExistingUser
};