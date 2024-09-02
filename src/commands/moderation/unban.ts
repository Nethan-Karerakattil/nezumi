import {
    type ChatInputCommandInteraction,
    type Client,
    PermissionsBitField,
    SlashCommandBuilder,
    EmbedBuilder,
    Colors,
} from "discord.js";

export default {
    data: new SlashCommandBuilder()
        .setName("unban")
        .setDescription("Unbans a member")
        .setDefaultMemberPermissions(PermissionsBitField.Flags.BanMembers)
        .setDMPermission(false)

        .addStringOption(option => option
            .setName("user-id")
            .setDescription("User ID of the banned user")
            .setRequired(true)),

    execute: async (interaction: ChatInputCommandInteraction<"cached">, client: Client): Promise<void> => {
        const target_id = interaction.options.getString("user-id")!;
        const ban_list = await interaction.guild.bans.fetch();
        const target = ban_list.find(ban => ban.user.id === target_id);

        if (!target) {
            await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle("User not found")
                        .setDescription("This user is not found or invalid ID was provided.")
                        .setColor(Colors.Red)
                ]
            });

            return;
        }

        await interaction.guild.members.unban(target_id);

        await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setTitle(`Successfully Unbanned ${target.user.tag}`)
                    .setDescription(`
                        Action By: ${interaction.user}
                        Target: ${target.user}
                    `)
                    .setColor(Colors.Green)
            ]
        });
    }
}