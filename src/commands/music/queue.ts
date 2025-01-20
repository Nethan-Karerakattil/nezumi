import {
    type ChatInputCommandInteraction,
    type Client,
    SlashCommandBuilder,
    EmbedBuilder,
    Colors
} from "discord.js";

export default {
    data: new SlashCommandBuilder()
        .setName("queue")
        .setDescription("Shows you the queue"),

    execute: async (interaction: ChatInputCommandInteraction<"cached">, client: Client): Promise<void> => {

        /* Handle user errors */
        const guildQueue = client.queues[interaction.guildId];
        if (!guildQueue) {
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

        /* Display queue */
        let message = "";
        if (guildQueue.queue.length == 0) {
            message = "Queue is currently empty. Try adding more songs using the /play command!"
        } else {
            for (let i = 0; i < guildQueue.queue.length; i++) {
                message += `${guildQueue.queue[i]}\n`;
            }
        }

        await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setTitle("Here is the queue!")
                    .setDescription(message)
                    .setColor(Colors.Green)
            ]
        });
    }
}