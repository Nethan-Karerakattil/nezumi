import {
    type ChatInputCommandInteraction,
    type Client,
    Colors,
    EmbedBuilder,
    SlashCommandBuilder
} from "discord.js";

export default {
    data: new SlashCommandBuilder()
        .setName("disconnect")
        .setDescription("Disconnects me from a voice chanel and deletes queue"),

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

        /* Destroy connection and delete queue */
        client.queues[interaction.guildId].connection.destroy();
        client.queues[interaction.guildId].player.stop();
        delete client.queues[interaction.guildId];

        await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setTitle("Success")
                    .setDescription("Deleted queue and left the voice channel")
                    .setColor(Colors.Green)
            ]
        });
    }
}