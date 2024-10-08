import {
    type ChatInputCommandInteraction,
    type Client,
    SlashCommandBuilder,
    PermissionsBitField,
    EmbedBuilder,
    Colors
} from "discord.js";

export default {
    data: new SlashCommandBuilder()
        .setName("ban")
        .setDescription("Bans a member")
        .setDefaultMemberPermissions(PermissionsBitField.Flags.BanMembers)
        .setDMPermission(false)

        .addUserOption(option => option
            .setName("user")
            .setDescription("Select a member to ban")
            .setRequired(true))

        .addStringOption(option => option
            .setName("reason")
            .setDescription("Reason for ban (optional)"))

        .addIntegerOption(option => option
            .setName("delete-messages-days")
            .setDescription("Number of days of messages to delete (Optional and must be between 0-7)")),

    execute: async (interaction: ChatInputCommandInteraction<"cached">, client: Client): Promise<void> => {
        const target_user = interaction.options.getUser("user")!;
        const target_member = interaction.options.getMember("user")!;
        const reason = interaction.options.getString("reason") ?? "Not Provided";
        const delete_msgs_days = interaction.options.getInteger("delete-messages-days");

        if (!target_member.bannable) {
            await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle("Unable to ban")
                        .setDescription("I do not have the required permissions to ban a member")
                        .setColor(Colors.Red)
                ]
            });

            return;
        }

        if (target_user.id === interaction.member.id) {
            await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle("Unable to ban")
                        .setDescription("You can't ban yourself silly!")
                        .setColor(Colors.Red)
                ]
            });

            return;
        }

        await target_user.send({
            embeds: [
                new EmbedBuilder()
                    .setTitle(`You have been banned from ${interaction.guild.name}`)
                    .setDescription(`
                        Action By: ${interaction.user}
                        Reason: ${reason}
                    `)
                    .setColor(Colors.Red)
            ]
        });

        if (!delete_msgs_days) {
            await target_member.ban({ reason: reason });
        } else {
            await target_member.ban({
                reason: reason,
                deleteMessageSeconds: 60 * 60 * 7 * delete_msgs_days
            });
        }

        await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setTitle(`Successfully Banned ${target_user.tag}`)
                    .setDescription(`
                        Action By: ${interaction.user}
                        Target: ${target_user}
                        Reason: ${reason}
                    `)
                    .setColor(Colors.Green)
            ]
        });
    }
}