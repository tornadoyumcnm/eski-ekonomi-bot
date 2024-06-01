module.exports = (client, config) => {

    client.login(config.bot.token).then(() => {
        console.log(`(*) ${config.bot.isim} Bot DC Girdi`);
    }).catch((err) => {
        console.log(`(-) ${config.bot.isim} Bot DC Giremedi: ${err}`);
    });

}