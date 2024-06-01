const Discord = require('discord.js')
const config = require('../../config');
const Balance = require('../../database/models/Balance.js');

module.exports = {
name: 'günlük',
aliases: ['daily'],

async execute(client, message, args) {

    const minAmount = 600;
    const maxAmount = 1000;
    const amount = Math.floor(Math.random() * (maxAmount - minAmount + 1) + minAmount);

    const user = await Balance.findOne({ userId: message.author.id });

    if (!user) {
        return message.channel.send({ content: 'Önce hesap oluşturmalısınız. +register komutunu kullanın.' });
    }

    const now = new Date();
    const dayInMillis = 24 * 60 * 60 * 1000;
    const lastDaily = user.lastDaily;

    if (lastDaily && now - lastDaily < dayInMillis) {
        const remainingTime = new Date(lastDaily.getTime() + dayInMillis - now.getTime());
        return message.channel.send(`Günlük para almak için ${remainingTime.getUTCHours()} saat ${remainingTime.getUTCMinutes()} dakika beklemelisin.`);
    }

    user.balance += amount;
    user.lastDaily = now;


    const embed = new Discord.EmbedBuilder()
        .setColor(config.other.renk)
        .setAuthor({ name: `${client.user.username} Balance Menüsü` })
        .setDescription(`${message.author.username}, günlük olarak **${amount}**🪙 para alındı.`)
        .setFooter({ text: `${message.author.tag} tarafından istendi.` })
        .setTimestamp();

    message.channel.send({ embeds: [embed] });

    await user.save();

    setTimeout(async () => {
        const updatedUser = await Balance.findOne({ userId: message.author.id });
        if (updatedUser && updatedUser.lastDaily && now - updatedUser.lastDaily >= dayInMillis) {
            updatedUser.lastDaily = null;
            await updatedUser.save();
        }
    }, dayInMillis);

},
};