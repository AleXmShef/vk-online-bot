const request = require('./requests');

async function getUserID(userLink) {
    const usID = await request.GetUserId(userLink);
    if(!usID) {
        return 0;
    }
    return usID;
}

async function getUserData(userID) {
    const user = await request.GetUserData(userID);
    if(!user) {
        return 0;
    }
    return user;
}

module.exports = {
    getUserID,
    getUserData
};