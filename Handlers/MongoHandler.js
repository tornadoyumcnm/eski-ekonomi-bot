module.exports = (client, config) => {

    client.on("ready", () => {
        require("../Database/connect.js")(config.database.mongo)
        console.log(`(*) MongoDB Başlatıldı.`)
    })

}
