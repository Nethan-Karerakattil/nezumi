import {
    type ChatInputCommandInteraction,
    type Client,
    PermissionsBitField,
    SlashCommandBuilder,
    EmbedBuilder
} from "discord.js";

export default {
    data: new SlashCommandBuilder()
        .setName("purge")
        .setDescription("Delete multiple messages at once")
        .setDefaultMemberPermissions(PermissionsBitField.Flags.ManageChannels)
        .setDMPermission(false)
        
        .addIntegerOption(option => option
            .setName("number-of-messages")
            .setDescription("Number of messages to delete")
            .setMaxValue(100)
            .setRequired(true)),

    execute: async (interaction: ChatInputCommandInteraction<"cached">, client: Client): Promise<void> => {
        const messages = interaction.options.getInteger("number-of-messages")!;

        await interaction.channel?.bulkDelete(messages);

        await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setTitle(`Successfully purged ${messages} messages`)
                    .setDescription(`
                        Action By: ${interaction.user}
                        Deleted Messages: ${messages}
                    `)
                    .setColor(0x3ded97)
            ]
        })
    }
}