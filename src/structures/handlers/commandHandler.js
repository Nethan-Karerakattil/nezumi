const fs = require("node:fs");
const { REST, Routes } = require("discord.js");
const config = require("../../../config.json");

module.exports = (client) => {
    client.handleCommands = async () => {

        const folders = fs.readdirSync("./src/commands");
        for(const folder of folders){
            const files = fs.readdirSync(`./src/commands/${folder}`);
            for(const file of files){
                const command = require(`../../commands/${folder}/${file}`);

                client.commands.set(command.data.name, command);
                client.commandsArr.push(command.data.toJSON());
            }
        }

        const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);
        try {
            const data = await rest.put(
                Routes.applicationGuildCommands(config.clientID, config.guildID),
                { body: client.commandsArr }
            )

            console.log("Successfully registered slash commands")
        }
        catch(err) {
            throw err;
        }
    }
}