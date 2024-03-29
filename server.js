//import environment variables
require('dotenv').config();

const tmi = require('tmi.js');
const blacklist = ['hello']

//define commands
// const commands = {
//     website: {
//         response: 'http://twitch.tv/zeparatist'
//     },
//     upvote: {
//         response: (user) => `User ${user} was upvoted`
//     }
// }

//Define new tmi client
const client = new tmi.Client({
    connection: {
        reconnect: true
    },
    channels: [ 'branchedgamingnetwork' ],
    identity: {
		username: process.env.TWITCH_BOT_USERNAME,
		password: process.env.TWITCH_OAUTH_TOKEN
	},
	
});

//Connect client
client.connect();


//TS Modules
client.on('connected', (address, port) => {
    console.log(address)
    console.log(port)
    client.say(channel, "Now live!")
})

// client.on('disconnected', (reason) => {
//     console.log(reason)
//     //client.say(channel, "End of stream!")
// })

client.on('logon', (channel) => {
    console.log(channel)
})


// client.on('join', (channel, username, self) => {
//     if(!self) client.say(channel, `Welcome, ${username}!`)
// })

// client.on('part', (channel, username, self) => {
//     if(!self) client.say(channel, `Goodbye, ${username}!`)
// })

// client.on('raided', (channel, username, viewers) => {
//     client.say(channel, `${username} has raided with ${viewers}`)
// })

// client.on('roomstate', (channel, state) => {
//     console.log(`Joined:${channel} ${state['room-id']}`)
// })




//Message listener
client.on('message', (channel, userstate, message, self) => {
    //ignore bot sent messages
    if(userstate.username === process.env.TWITCH_BOT_USERNAME) return;
    
    // //Auto mod features to get message id's and delete them if they contain blacklisted words
    // chatMod(userstate, message, channel);
    
    //determine if message is a command    
    if(!message.startsWith('!')) return;

    //slice command keyword
	const args = message.slice(1).split(' ');
	const command = args.shift().toLowerCase();


    //cross check command keywords
	switch (command) {
        case 'bgn':
            client.say(channel, `We are sponsoring this event! \nJoin BGN: https://discord.gg/tT2Vaqaj`);
            break;
        case 'test':
            console.log('test message for case 2');
            break;
        default:
            console.log('No command found');
    }
    
    
    // //Reference commands
    // if(command === 'echo') {
	// 	client.say(channel, `@${userstate.username}, you said: "${args.join(' ')}"`);
	// }
    // else if (command === 'bgn') {
    //     client.say(channel, `https://discord.gg/tT2Vaqaj`)
    // }
    // else if (command === 'test') {
    //     client.say(channel, `Watching: ${client.getUsername()}`)
    // }
});


//Functions
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