//import environment variables
require('dotenv').config();

const tmi = require('tmi.js');

const reqexpCommand = new RegExp(/^!([a-zA-Z0-9]+)(?:\W+)?(.*)?/);


//define commands
const commands = {
    website: {
        response: 'http://twitch.tv/zeparatist'
    },
    upvote: {
        response: (user) => `User ${user} was upvoted`
    }
}

//Define new tmi client
const client = new tmi.Client({
    connection: {
        reconnect: true
    },
    channels: [ 'Zeparatist' ],
    identity: {
		username: process.env.TWITCH_BOT_USERNAME,
		password: process.env.TWITCH_OAUTH_TOKEN
	},
	
});

//Connect client
client.connect();

//Message listener
client.on('message', (channel, userstate, message, self) => {
    if(userstate.username === process.env.TWITCH_BOT_USERNAME || !message.startsWith('!')) return;

	const args = message.slice(1).split(' ');
	const command = args.shift().toLowerCase();

	if(command === 'echo') {
		client.say(channel, `@${userstate.username}, you said: "${args.join(' ')}"`);
	}
});