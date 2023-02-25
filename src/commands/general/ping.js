const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Replies with pong!"),

    async execute(interaction, client){
        await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setTitle("Pong!")
                    .setDescription(`Bot Latency: ${Date.now() - interaction.createdTimestamp}\nAPI Latency: ${Math.round(client.ws.ping)}`)
                    .setColor(0x1DB954)
            ]
        })
    }
}