const { CommandoClient } = require('discord.js-commando');
const path = require('path');
const __CONFIG__ = require('./config.json');

const client = new CommandoClient({
    commandPrefix: __CONFIG__.prefix,
    owner: __CONFIG__.ownerId,
    disableEveryone: true
});

client.registry
    .registerDefaultTypes()
    .registerGroups([
        ['игрульки', 'Разные игрульки']
    ])
    // .registerDefaultGroups()
    // .registerDefaultCommands()
    .registerCommandsIn(path.join(__dirname, 'commands'));

client.on('ready', () => {
    console.log('Logged in!');
    client.user.setActivity('чат', {ActivityType: 'LISTENING'});
});
client.login(__CONFIG__.token);