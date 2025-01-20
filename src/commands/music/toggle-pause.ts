import {
    type ChatInputCommandInteraction,
    type Client,
    SlashCommandBuilder,
    EmbedBuilder,
    Colors
} from "discord.js";

export default {
    data: new SlashCommandBuilder()
        .setName("toggle-pause")
        .setDescription("Pauses the song that is currently playing"),

    execute: async (interaction: ChatInputCommandInteraction<"cached">, client: Client): Promise<void> => {

        /* Handle user errors */
        if (!client.queues[interaction.guildId]) {
            await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle("Incorrect usage")
                        .setDescription("You must use the play command first")
                        .setColor(Colors.Red)
                ]
            });

            return;
        }

        /* Toggle pause */
        if (!client.queues[interaction.guildId].isPaused) {
            client.queues[interaction.guildId].player.unpause();
        } else {
            client.queues[interaction.guildId].player.pause();
        }
        
        await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setTitle("Success!")
                    .setDescription("Successfully paused the player!")
                    .setColor(Colors.Green)
            ]
        })
    }
}