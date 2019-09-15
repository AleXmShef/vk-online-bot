const axios = require('axios');
const vktoken = '781926eb013b90b442cdb0c287d005afae73e9438e0a6eed4f6e0f0e61dac0bcd4e12be78fd79d571a275';

const idExpr = /^id(.+)/;

async function GetUserId(userLink) {
    try {
        const res = idExpr.exec(userLink);
        if(res) {
            const id = userLink.split("id");
            const user = await axios.get(`https://api.vk.com/method/users.get?user_id=${id[1]}&v=5.52&access_token=${vktoken}`);
            console.log("id search");
            console.log(id[1]);
            console.log(user.data.response[0]);
            return user.data.response[0].id;
        }
        else {
            const user = await axios.get(`https://api.vk.com/method/users.search?q=${userLink}&v=5.52&access_token=${vktoken}`);
            console.log("custom search");
            console.log(user.data);
            console.log(user.data.response.items[0]);
            return user.data.response.items[0].id;
        }
    } catch (err) {
        console.log(err);
    }
}

async function GetUserData(userID) {
    try {
        const user = await axios.get(`https://api.vk.com/method/users.get?user_id=${userID}&fields=online&v=5.52&access_token=${vktoken}`);
        //console.log(user);
        return user.data.response[0];
    } catch (err) {
        console.log(`"Error during user data fetching, failed user id: ${userID}"`);
        console.log(err);
    }
}

module.exports = {
    GetUserId,
    GetUserData
};