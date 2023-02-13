const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus } = require("@discordjs/voice");
const { SlashCommandBuilder } = require("discord.js");
const songModal = require("../../modals/song");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("play-song")
        .setDescription("Plays a song in a Voice Channel")

        .addStringOption(option => option
            .setName("id")
            .setDescription("The ID of the video you want to play")),

    async execute(interaction, client){
        const id = interaction.options.getString("id");
        const player = createAudioPlayer()

        let connection;
        let queue;

        songModal.exists({ _id: id }, (err, data) => {
            if(err) return console.error(err)
            if(!data) return console.error("404: ID does not exist in the db")

            queue = client.queues.get(interaction.guild.id);
            if(!queue) client.queues.set(interaction.guild.id, [id]);
            else {
                queue.push(id)
                client.queues.set(interaction.guild.id, queue);
            }

            if(!interaction.guild.members.me.voice.channel) connect();
        })

        player.on(AudioPlayerStatus.Idle, () => {
            console.log("Subscribing new song...")

            queue = client.queues.get(interaction.guild.id);
            queue.shift();

            if(queue.length == 0){
                connection.destroy();
                client.queues.delete(interaction.guild.id);
                return console.log("Queue was over, so I destroyed the connection");
            }

            play(queue[0]);
        })

        function connect(){
            console.log("Reached connect function")

            const voiceChannel = interaction.member.voice.channel;
            if(!voiceChannel){
                client.queues.delete(interaction.guild.id);
                console.log("401: No Voice Channel detected")
            }

            connection = joinVoiceChannel({
                channelId: voiceChannel.id,
                guildId: interaction.guild.id,
                adapterCreator: interaction.guild.voiceAdapterCreator
            })

            queue = client.queues.get(interaction.guild.id)
            play(queue[0])
        }

        function play(song){
            console.log("Reached play function")
            songModal.findOne({ _id: song }, (err, data) => {
                if(err) return console.log(err);
                if(!data) return console.log(data)

                const resource = createAudioResource(`./songs/${data.id}.${data.song_info.ext}`)
                player.play(resource);
                connection.subscribe(player);
    
                console.log(`Now Playing: ${data.song_info.song_name}`);  
            })
        }
    }
}