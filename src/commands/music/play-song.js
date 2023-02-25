const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus } = require("@discordjs/voice");
const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const songModal = require("../../modals/song");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("play-song")
        .setDescription("Plays a song in a Voice Channel")

        .addStringOption(option => option
            .setName("id")
            .setDescription("The ID of the video you want to play")
            .setRequired(true)),

    async execute(interaction, client){
        const id = interaction.options.getString("id");
        const player = createAudioPlayer();

        let connection;
        let queue;

        songModal.findOne({ _id: id }, async (err, data) => {
            if(err) return handleError(err);
            if(!data) return await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle("This ID doesnt exist")
                        .setDescription("This ID doesnt exist. Make sure you typed the ID correctly.")
                        .setColor(0xff0000)
                ]
            })

            queue = client.queues.get(interaction.guild.id);
            if(!queue) {
                client.queues.set(interaction.guild.id, [data]);
            }
            else {
                queue.push(data)
                client.queues.set(interaction.guild.id, queue);
            }
            
            await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle("The song has been added to the queue.")
                        .setColor(0x1DB954)
                ]
            })

            if(!interaction.guild.members.me.voice.channel) connect();
        })

        player.on(AudioPlayerStatus.Idle, async () => {
            queue = client.queues.get(interaction.guild.id);
            queue.shift();

            if(queue.length == 0){
                connection.destroy();
                client.queues.delete(interaction.guild.id);

                return await interaction.channel.send({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle("The queue ended.")
                            .setDescription("The queue ended so I left the Voice Channel. If you wish to listen to more music, use the play command again!")
                            .setColor(0x1DB954)
                    ]
                })
            }

            play(queue[0]);
        })
        
        async function connect(){
            const voiceChannel = interaction.member.voice.channel;
            if(!voiceChannel){
                client.queues.delete(interaction.guild.id);
                return await interaction.editReply({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle("No Voice Channel detected")
                            .setDescription("You must join a Voice Channel before sending the play command")
                            .setColor(0xff0000)
                    ]
                })
            }

            connection = joinVoiceChannel({
                channelId: voiceChannel.id,
                guildId: interaction.guild.id,
                adapterCreator: interaction.guild.voiceAdapterCreator
            })

            queue = client.queues.get(interaction.guild.id)
            play(queue[0])
        }

        async function play(song){
            const resource = createAudioResource(`./songs/${song.id}.${song.song_info.ext}`)
            player.play(resource);
            connection.subscribe(player);
    
            await interaction.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setTitle(`Now playing: ${song.song_info.song_name}`)
                        .setColor(0x1DB954)
                ]
            })
        }

        async function handleError(err){
            console.error(err);

            await interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle("Something went wrong")
                        .setDescription("Something went wrong when trying to retrive data from the database")
                        .setColor(0xff0000)
                ]
            })
        }
    }
}