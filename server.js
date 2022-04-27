//import environment variables
require('dotenv').config();

const tmi = require('tmi.js');

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

const blacklist = ['goodbye', 'loser']

//Message listener
client.on('message', (channel, userstate, message, self) => {
    if(userstate.username === process.env.TWITCH_BOT_USERNAME) return;
    chatMod(userstate, message, channel);
    if(!message.startsWith('!')) return;

    //Auto mod features to get message id's and delete them if they contain blacklisted words.
    

	const args = message.slice(1).split(' ');
	const command = args.shift().toLowerCase();

	if(command === 'echo') {
		client.say(channel, `@${userstate.username}, you said: "${args.join(' ')}"`);
	}
    else if (command === 'bgn') {
        client.say(channel, `https://discord.gg/tT2Vaqaj`)
    }
    else if (command === 'test') {
        client.say(channel, `Watching: ${client.getUsername()}`)
    }
});

function chatMod(userstate, message, channel) {
    message.toLowerCase();
    //default false
    let shouldSendMessage = false;

    //check message
    shouldSendMessage = blacklist.some(word => message.includes(word.toLowerCase()));

    if(shouldSendMessage) {
       //Notify user
        client.say(channel, `@${userstate.username} that word is banned!`);

        //Delete message
        client.deletemessage(channel, userstate.id)
        .catch((err) => console.log(err))
    }
}