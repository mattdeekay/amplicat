const kv = require('lib')({token: process.env.STDLIB_TOKEN}).utils.kv;
const request = require('request');
const catAPI = 'http://ampli-cats.herokuapp.com/randcat';
const numRequests = 10;

function getRandomCat() {
  return new Promise((resolve, reject) => {
    request({
      url: catAPI,
      method: 'GET',
    }, function (error, res, body) {
      resolve(body);
    });
  });
}

/**
* Refresh
*
*   Refreshes the cat url cache every five minutes.
*
* @param {string} user The user id of the user that invoked this command (name is usable as well)
* @param {string} channel The channel id the command was executed in (name is usable as well)
* @param {string} text The text contents of the command
* @param {object} command The full Slack command object
* @param {string} botToken The bot token for the Slack bot you have activated
* @returns {object}
*/
module.exports = async (user, channel, text = '', command = {}, botToken = null) => {
  const promises = [];
  for (var i = 0; i < numRequests; i++) {
    promises.push(getRandomCat());
  }
  await Promise.all(promises).then(async(values) => {
    let currentLinks = await kv.get({
      key: 'catURL'
    });
    let newLinks = Array.from(new Set(values.concat(currentLinks)));
    newLinks.slice(0, numRequests);
    return await kv.set({
      key: 'catURL',
      value: newLinks
    });
  });
  return (null, {});
};