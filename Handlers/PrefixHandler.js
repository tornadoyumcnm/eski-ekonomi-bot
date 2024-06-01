const fs = require('fs');
const path = require('path');
const Balance = require('../database/models/Balance.js');
const Discord = require('discord.js')

module.exports = (client, config) => {
    client.commands = new Map();
    client.aliases = new Map();

    const categories = fs.readdirSync(path.join(__dirname, '../commands'));

    for (const category of categories) {
        const commandFiles = fs.readdirSync(path.join(__dirname, `../commands/${category}`)).filter(file => file.endsWith('.js'));

        for (const file of commandFiles) {
            const command = require(path.join(__dirname, `../commands/${category}/${file}`));
            client.commands.set(command.name, command);

            if (command.aliases && Array.isArray(command.aliases)) {
                command.aliases.forEach(alias => {
                    client.aliases.set(alias, command.name);
                });
            }
        }
    }

    client.on('messageCreate', async (message) => {
        if (!message.guild || message.author.bot) return;

        const prefix = config.bot.prefix;
        if (!message.content.startsWith(prefix)) return;

        const args = message.content.slice(prefix.length).trim().split(/ +/);
        const commandName = args.shift().toLowerCase();

        const user = await Balance.findOne({ userId: message.author.id });

        if (!user) {
            const embed = new Discord.EmbedBuilder()
                .setColor(config.other.renk)
                .setAuthor({ name: `Hesap Oluşturmanız Gerekiyor` })
                .setDescription('> Hesap oluşturmak için aşağıdaki butona tıklayın.');

            const row = new Discord.ActionRowBuilder().addComponents(
                new Discord.ButtonBuilder()
                    .setCustomId('register')
                    .setLabel('Hesap Oluştur')
                    .setEmoji('🗒️')
                    .setStyle(Discord.ButtonStyle.Secondary)
            );

            message.channel.send({ embeds: [embed], components: [row] });
            return;
        }

        const command = client.commands.get(commandName) || client.commands.get(client.aliases.get(commandName));

        if (command) {
            command.execute(client, message, args);
        }
    });

    client.on('interactionCreate', async (interaction) => {
        if (!interaction.isButton()) return;

        if (interaction.customId === 'register') {
            const existingUser = await Balance.findOne({ userId: interaction.user.id });
            if (!existingUser) {
                const newUser = new Balance({ userId: interaction.user.id });

                newUser.balance += 1000;
                await newUser.save();

                await interaction.reply({ content: 'Başarıyla kayıt oldunuz! **1000 para** verildi.', ephemeral: true });
            } else {
                await interaction.reply({ content: 'Zaten kayıtlısınız.', ephemeral: true });
            }
        }})
};
