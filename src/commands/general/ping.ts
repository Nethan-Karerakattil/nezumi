import {
    type ChatInputCommandInteraction,
    type Client,
    EmbedBuilder,
    SlashCommandBuilder
} from "discord.js";

export default {
    data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Pings the server"),

    execute: async (interaction: ChatInputCommandInteraction<"cached">, client: Client): Promise<void> => {
        await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setTitle("Pong! 🏓")
                    .setDescription(`API Latency: ${client.ws.ping}`)
                    .setColor(0x625a57)
            ]
        })
    }
}