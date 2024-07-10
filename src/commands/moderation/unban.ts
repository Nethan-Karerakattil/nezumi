import {
    SlashCommandBuilder,
    ChatInputCommandInteraction,
    PermissionsBitField,
    EmbedBuilder,
    Client
} from "discord.js";

export default {
    data: new SlashCommandBuilder()
        .setName("unban")
        .setDescription("Unbans a member")

        .addStringOption(option => option
            .setName("user-id")
            .setDescription("User ID of the banned user")
            .setRequired(true)),

    async execute(interaction: ChatInputCommandInteraction<'cached'>, client: Client){
        const target_id = interaction.options.getString("user-id")!;
        const ban_list = await interaction.guild.bans.fetch();
        const target = ban_list.find(ban => ban.user.id === target_id);

        if(!target) return await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setTitle("Invalid User ID")
                    .setDescription("The User ID does not match a user.")
                    .setColor(0xdf2c14)
            ]
        });

        if(!interaction.member.permissions.has(PermissionsBitField.Flags.BanMembers))
            return await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle("Insufficient permissions")
                        .setDescription("You do not have the required permissions")
                        .setColor(0xdf2c14)
                ]
            });

        await interaction.guild.members.unban(target_id);

        await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setTitle(`Successfully Unbanned ${target.user.tag}`)
                    .setDescription(`
                        Action By: ${interaction.user}
                        Target: ${target.user}
                    `)
                    .setColor(0x3ded97)
            ]
        });
    }
}