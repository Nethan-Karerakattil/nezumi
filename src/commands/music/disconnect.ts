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

        /* Delete queue */
        client.queues[interaction.guildId].connection.destroy();
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