import {
    type Interaction,
    type Client,
    EmbedBuilder,
    Events
} from "discord.js"

export default {
    name: Events.InteractionCreate,
    once: false,

    execute: async (interaction: Interaction, client: Client) => {
        if(interaction.isChatInputCommand()){
            if(!interaction.commandName) return;

            try {
                const command = client.commands.get(interaction.commandName);
                await command.execute(interaction, client);
            } catch(err) {
                console.error(err);

                return await interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle("Error: 500")
                            .setDescription("Internal Server Error")
                            .setColor(0xf00)
                    ]
                })
            }
        }
    }
}