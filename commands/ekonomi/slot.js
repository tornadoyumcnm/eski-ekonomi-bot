const Discord = require('discord.js')
const config = require('../../config');
const Balance = require('../../database/models/Balance.js');

module.exports = {
name: 'slot',
aliases: ['slots'],

async execute(client, message, args) {

const betAmount = parseInt(args[0]);
if (isNaN(betAmount) || betAmount <= 0 || betAmount > 100000) {
    return message.reply('Lütfen 1 ile 100.000 arasında geçerli bir bahis miktarı girin.');
}

let user = await Balance.findOne({ userId: message.author.id });
if (!user) {
    user = new Balance({ userId: message.author.id, balance: 0 });
}

if (user.balance < betAmount) {
    return message.reply('Bahis yapmak için yeterli paranız yok!');
}

user.balance -= betAmount;


const emojis = ['🍒', '🍋', '🍊'];

const getRandomEmoji = () => emojis[Math.floor(Math.random() * emojis.length)];

const slot1 = getRandomEmoji();
const slot2 = getRandomEmoji();
const slot3 = getRandomEmoji();

const embeds = await message.channel.send({
embeds: [
new Discord.EmbedBuilder()
.setColor(config.other.renk)
.setAuthor({ name: `🎰 ${config.bot.isim} Slot Makinesi 🎰` })
.setDescription(`\`\`\`| ${slot1} | ${slot2} | ${slot3} |\`\`\``)
.setFooter({ text: `${message.author.username} tarafından istendi.`, iconURL: message.author.avatarURL({ dynamic: true }) })
.setTimestamp()
]
})

if (slot1 === slot2 && slot2 === slot3) {
    const winnings = betAmount * 2; // Double the bet amount as winnings
    user.balance += winnings;
    await user.save();
    await embeds.edit(`🎉 Tebrikler, kazandınız!`);
} else {
    await user.save();
    await embeds.edit('🚯 Maalesef, kaybettiniz. Tekrar deneyin!');
}

},
};