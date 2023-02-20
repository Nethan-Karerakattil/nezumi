const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { getVoiceConnection } = require("@discordjs/voice");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("leave")
        .setDescription("Leaves the voice channel I am connected to"),

    async execute(interaction, client){
        if(!interaction.member.voice.channel) return await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setTitle("You must join a Voice Channel")
                    .setDescription("You must join a Voice Channel beofre executing this command")
                    .setColor(0xff0000)
            ]
        })

        if(!interaction.guild.members.me.voice.channel) return await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setTitle("I am not connected to a Voice Channel")
                    .setDescription("I must be connected to a Voice Channel for this command to work.")
                    .setColor(0xff0000)
            ]
        })

        getVoiceConnection(interaction.guild.id).disconnect()
        
        await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setTitle("Successfull!")
                    .setDescription("Successsfully left the voice channel")
                    .setColor(0x1DB954)
            ]
        })
    }
}