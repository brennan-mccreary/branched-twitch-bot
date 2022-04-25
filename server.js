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
client.on('message', (channel, tags, message, self) => {
	const isNotBot = tags.username.toLowerCase() !== process.env.TWITCH_BOT_USERNAME;

    if ( !isNotBot ) return;

    if(message[0] === '!') {
        const [raw, command, argument] = message.match(reqexpCommand);

        const { response } = commands[command] || {}; 

        if(typeof response === 'function') {
            client.say(channel, response(argument))
        }
        else if (typeof response === 'string') {
            client.say(channel, response)
        }
    }
});