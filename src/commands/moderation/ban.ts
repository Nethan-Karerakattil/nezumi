import {
    type ChatInputCommandInteraction,
    type Client,
    SlashCommandBuilder,
    PermissionsBitField,
    EmbedBuilder
} from "discord.js";

export default {
    data: new SlashCommandBuilder()
        .setName("ban")
        .setDescription("Bans a member")
        .setDefaultMemberPermissions(PermissionsBitField.Flags.BanMembers)
        .setDMPermission(false)

        .addUserOption(option => option
            .setName("target")
            .setDescription("Select a member to ban")
            .setRequired(true))

        .addStringOption(option => option
            .setName("reason")
            .setDescription("Reason for ban (optional)"))

        .addIntegerOption(option => option
            .setName("delete-messages-days")
            .setDescription("Number of days of messages to delete (Optional and must be between 0-7)")),

    execute: async (interaction: ChatInputCommandInteraction<"cached">, client: Client): Promise<void> => {
        const target_user = interaction.options.getUser("target")!;
        const target_member = interaction.options.getMember("target")!;
        const reason = interaction.options.getString("reason") ?? "Not Provided";
        const delete_msgs_days = interaction.options.getInteger("delete-messages-days");

        if(!target_member.bannable){
            await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle("Unable to ban")
                        .setDescription("I do not have the required permissions to ban a member")
                        .setColor(0xdf2c14)
                ]
            });

            return;
        }

        if(target_user.id === interaction.member.id){
            await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle("Unable to ban")
                        .setDescription("You can't ban yourself silly!")
                        .setColor(0xdf2c14)
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
                    .setColor(0xdf2c14)
            ]
        });

        if(!delete_msgs_days){
            await target_member.ban({ reason: reason });
            return;
        }

        await target_member.ban({
            reason: reason,
            deleteMessageSeconds: 60 * 60 * 7 * delete_msgs_days
        });

        await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setTitle(`Successfully Banned ${target_user.tag}`)
                    .setDescription(`
                        Action By: ${interaction.user}
                        Target: ${target_user}
                        Reason: ${reason}
                    `)
                    .setColor(0x3ded97)
            ]
        });
    }
}