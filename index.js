const Discord = require("discord.js");
const client = new Discord.Client({ intents: [Discord.GatewayIntentBits.Guilds, Discord.GatewayIntentBits.GuildMembers, Discord.GatewayIntentBits.MessageContent, Discord.GatewayIntentBits.GuildMessages, Discord.GatewayIntentBits.GuildEmojisAndStickers, Discord.GatewayIntentBits.GuildMessageReactions, Discord.GatewayIntentBits.GuildVoiceStates], messages: { interval: 3600, lifetime: 1800, }, users: { interval: 3600, filter: () => user => user.bot && user.id !== client.user.id, } })
const config = require("./config.js")

require("./Handlers/ReadyHandler.js")(client, config);
require("./Handlers/ButtonHandler.js")(client, config);
require("./Handlers/PrefixHandler.js")(client, config);
require("./Handlers/MongoHandler.js")(client, config);
require("./Handlers/LoginHandler.js")(client, config);

/*
process.on('uncaughtException', (err) => {
    return;
})
*/