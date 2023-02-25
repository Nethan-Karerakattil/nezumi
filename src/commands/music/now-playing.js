const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("now-playing")
        .setDescription("Shows you the song that is currently playing"),

    async execute(interaction, client){
        const queue = client.queues.get(interaction.guild.id);
    
        await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setTitle(`Now playing: ${queue[0].song_info.song_name}`)
                    .setColor(0x7289da)
            ]
        })
    }
}