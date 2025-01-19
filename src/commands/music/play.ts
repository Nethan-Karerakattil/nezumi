import {
    type ChatInputCommandInteraction,
    type Client,
    SlashCommandBuilder,
    EmbedBuilder,
    Colors
} from "discord.js";

import {
    type AudioPlayer,
    type VoiceConnection,
    AudioPlayerStatus,
    createAudioPlayer,
    createAudioResource,
    entersState,
    joinVoiceChannel,
    NoSubscriberBehavior
} from "@discordjs/voice";

import ytdl from "@distube/ytdl-core";

export default {
    data: new SlashCommandBuilder()
        .setName("play")
        .setDescription("Plays a song in a voice channel")

        .addStringOption(option => option
            .setName("song-url")
            .setDescription("URL of the song that you want to play")
            .setRequired(true)),

    execute: async (interaction: ChatInputCommandInteraction<"cached">, client: Client): Promise<void> => {

        /* Handle user errors */
        if (!interaction.member.voice.channelId) {
            await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle("Incorrect usage")
                        .setDescription("You must be connected to a voice channel to use this command.")
                        .setColor(Colors.Red)
                ]
            });

            return;
        }

        if (!interaction.channel) {
            await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle("Incorrect usage")
                        .setDescription("You must use this command in a text channel")
                        .setColor(Colors.Red)
                ]
            });

            return;
        }

        const url = interaction.options.getString("song-url")!;

        /* Create queue if it doens't exist */
        if (!client.queues[interaction.guildId]) {
            client.queues[interaction.guildId] = {
                connection: joinVoiceChannel({
                    channelId: interaction.member.voice.channelId,
                    guildId: interaction.guildId,
                    adapterCreator: interaction.channel.guild.voiceAdapterCreator
                }),

                player: createAudioPlayer({
                    behaviors: {
                        noSubscriber: NoSubscriberBehavior.Pause
                    }
                }),

                queue: []
            };

            /* Play song */
            const {player, connection} = client.queues[interaction.guildId];
            if (!await play(player, connection, url)) {
                await interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle("Failed to play")
                            .setDescription("Something went wrong when trying to play " + url)
                            .setColor(Colors.Red)
                    ]
                });

                return;
            } else {
                await interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle("Success!")
                            .setDescription("Playing: " + url)
                            .setColor(Colors.Green)
                    ]
                });
            }

            /* When player is idle */
            player.on(AudioPlayerStatus.Idle, async () => {
                const nextSong = client.queues[interaction.guildId].queue.shift(); // pop first element

                /* Song queue is empty */
                if (!nextSong) {
                    await interaction.channel?.send({
                        embeds: [
                            new EmbedBuilder()
                                .setTitle("Finished queue!")
                                .setDescription("The queue got over so I left. Feel free to use the play command again!")
                                .setColor(Colors.Green)
                        ]
                    });

                    connection.destroy();
                    delete client.queues[interaction.guildId];
                    return;
                }

                /* Play next song */
                if (!await play(player, connection, nextSong)) {
                    await interaction.channel?.send({
                        embeds: [
                            new EmbedBuilder()
                                .setTitle("Failed to play")
                                .setDescription("Something went wrong when trying to play " + nextSong)
                                .setColor(Colors.Red)
                        ]
                    });

                    return;
                }

                await interaction.channel?.send({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle("Playing next song")
                            .setDescription("Now playing: " + nextSong)
                            .setColor(Colors.Green)
                    ]
                });
            });

            /* When player encounters an error */
            player.on("error", async () => {
                await interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle("Error")
                            .setDescription("Unexpected error while playing audio.")
                            .setColor(Colors.Red)
                    ]
                });

                return;
            });

            return;
        }
        
        client.queues[interaction.guildId].queue.push(url);
    }
}

/**
 * Plays a song in a channel
 * @param player
 * @param connection
 * @param url
 * @returns success?
 */
async function play(player: AudioPlayer, connection: VoiceConnection, url: string): Promise<boolean> {
    player.play(createAudioResource(ytdl(url, {filter: "audioonly"})));
    connection.subscribe(player);

    try {
        await entersState(player, AudioPlayerStatus.Playing, 10_000);
    } catch(err) {
        console.error(err);
        return false;
    }

    return true;
}