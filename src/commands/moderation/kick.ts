import {
    type Client,
    type ChatInputCommandInteraction,
    SlashCommandBuilder,
    PermissionsBitField,
    EmbedBuilder,
    Colors
} from "discord.js";

export default {
    data: new SlashCommandBuilder()
        .setName("kick")
        .setDescription("Kicks a member")
        .setDefaultMemberPermissions(PermissionsBitField.Flags.BanMembers)
        .setDMPermission(false)

        .addUserOption(option => option
            .setName("user")
            .setDescription("User to kick")
            .setRequired(true)),

    execute: async (interaction: ChatInputCommandInteraction<"cached">, client: Client): Promise<void> => {
        const target_user = interaction.options.getUser("user")!;
        const target_member = interaction.options.getMember("user")!;

        if (!target_member.kickable) {
            await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle("Unable to kick")
                        .setDescription("I am not allowed to kick this member")
                        .setColor(Colors.Red)
                ]
            });

            return;
        }

        if (interaction.user.id == target_user.id) {
            await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle("Unable to kick")
                        .setDescription("You can't kick yourself silly!")
                        .setColor(Colors.Red)
                ]
            });

            return;
        }
        await target_user.send({
            embeds: [
                new EmbedBuilder()
                    .setTitle(`You have been kicked from ${interaction.guild.name}`)
                    .setDescription(`Action By: ${interaction.user}`)
                    .setColor(Colors.Red)
            ]
        });

        await target_member.kick();

        await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setTitle(`Successfully Kicked ${target_user.tag}`)
                    .setDescription(`
                        Action By: ${interaction.user}
                        Target: ${target_user}    
                    `)
                    .setColor(Colors.Green)
            ]
        })
    }
}