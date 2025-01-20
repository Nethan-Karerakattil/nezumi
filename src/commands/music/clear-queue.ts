import {
    type ChatInputCommandInteraction,
    type Client,
    SlashCommandBuilder,
    EmbedBuilder,
    Colors
} from "discord.js";

export default {
    data: new SlashCommandBuilder()
        .setName("clear-queue")
        .setDescription("Clears the queue"),

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

        /* Clear queue */
        client.queues[interaction.guildId].queue = [];

        await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setTitle("Success")
                    .setDescription("Queue cleared!")
                    .setColor(Colors.Green)
            ]
        });
    }
}