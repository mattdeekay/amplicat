const kv = require('lib')({token: process.env.STDLIB_TOKEN}).utils.kv;
const request = require('request');
const preset = ['http://ampli-cats.herokuapp.com/download.jpeg'];
const catAPI = 'http://ampli-cats.herokuapp.com/randcat';

function randomChoice(arr) {
    return arr[Math.floor(arr.length * Math.random())];
}
/**
* /cat
*
*   Attaches a picture of a random cat.
*
* @param {string} user The user id of the user that invoked this command (name is usable as well)
* @param {string} channel The channel id the command was executed in (name is usable as well)
* @param {string} text The text contents of the command
* @param {object} command The full Slack command object
* @param {string} botToken The bot token for the Slack bot you have activated
* @returns {object}
*/
module.exports = async (user, channel, text = '', command = {}, botToken = null) => {
  // Preset kv cat url cache 
  let result = await kv.get({
    key: 'catURL'
  });
  if (!result) {
    await kv.set({
      key: 'catURL',
      value: preset
    });
    result = preset;
  }

  // Randomly select url from in-memory cache
  const url = randomChoice(result);
  return (null, {
    response_type: "ephemeral",
    attachments: [
      {
        text: 'meow!',
        image_url: url
      }
    ]
  });
};