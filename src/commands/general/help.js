const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const fs = require("node:fs");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("help")
        .setDescription("Shows you the help menu"),

    async execute(interaction, client){
        let message = ""

        const folders = fs.readdirSync("./src/commands/");
        for(const folder of folders){
            const files = fs.readdirSync(`./src/commands/${folder}`);
            for(const file of files){
                const commandFile = require(`../${folder}/${file}`);

                message += "`" + commandFile.data.name + "`: " + commandFile.data.description + "\n"
            }
        }

        await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setTitle("Here are my commands")
                    .setDescription(message)
                    .setColor(0x7289da)
            ]
        })
    }
}