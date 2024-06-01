module.exports = (client, config) => {
    client.on('ready', () => {
        setInterval(() => {
            client.user.setActivity(config.bot.durum);
        }, 5000);
        console.log(`(*) Bot Durum Aktif.`);
    });
};