const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { createAudioPlayer, createAudioResource, joinVoiceChannel, AudioPlayerStatus } = require("@discordjs/voice");
const songModal = require("../../modals/song");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("play-song")
        .setDescription("Plays a song in a Voice Channel")

        .addStringOption(option => option
            .setName("id")
            .setDescription("The ID of the song you want to play")
            .setRequired(true)),

    async execute(interaction, client){
        const id = interaction.options.getString("id");

        songModal.findOne({ _id: id }, async (err, data) => {
            if(err) return await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle("Something went wrong")
                        .setDescription("Something went wrong when trying to retrive the data")
                        .setColor(0xff0000)
                ]
            })

            const voiceChannel = interaction.member.voice.channel;
            if(!voiceChannel) return;

            const player = createAudioPlayer();
            const resource = createAudioResource(`./songs/${data.id}.${data.song_info.ext}`)

            const connection = joinVoiceChannel({
                channelId: voiceChannel.id,
                guildId: interaction.guild.id,
                adapterCreator: interaction.guild.voiceAdapterCreator
            })

            player.play(resource)
            connection.subscribe(player)

            await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle(`Now playing: ${data.song_info.song_name}`)
                        .setColor(0x1DB954)
                ]
            })

            // Events
            player.on(AudioPlayerStatus.Idle, () => {
                connection.destroy();
            })
        })
    }
}