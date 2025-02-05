import {
    type Interaction,
    type Client,
    EmbedBuilder,
    Events,
    Colors
} from "discord.js"

export default {
    name: Events.InteractionCreate,
    once: false,

    execute: async (interaction: Interaction, client: Client): Promise<void> => {
        if (interaction.isChatInputCommand()) {
            if (!interaction.commandName) return;

            try {
                const command = client.commands.get(interaction.commandName);
                await command.execute(interaction, client);
            } catch (err) {
                console.error(err);

                await interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle("Error: 500")
                            .setDescription("Internal Server Error")
                            .setColor(Colors.Red)
                    ]
                });

                return;
            }
        }
    }
}