const Discord = require('discord.js')
const config = require('../../config');

module.exports = {
name: 'balance',
aliases: ['money', 'para', 'param', 'cash'],

async execute(client, message, args) {

await message.channel.send({
embeds: [
new Discord.EmbedBuilder()
.setColor(config.other.renk)
.setAuthor({ name: `${config.bot.isim} Balance Menüsü` })
.setDescription(``)
.setFooter({ text: `${message.author.username} tarafından istendi.`, iconURL: message.author.avatarURL({ dynamic: true }) })
.setTimestamp()
]
})

},
};