import {
    type Client,
    type ChatInputCommandInteraction,
    PermissionsBitField,
    SlashCommandBuilder,
    EmbedBuilder
} from "discord.js";

export default {
    data: new SlashCommandBuilder()
        .setName("timeout")
        .setDescription("Give a timeout, or remove a timeout from a user")
        .setDefaultMemberPermissions(PermissionsBitField.Flags.MuteMembers)
        .setDMPermission(false)

        .addSubcommand(command => command
            .setName("add")
            .setDescription("Gives a timeout to a user")

            .addUserOption(option => option
                .setName("target")
                .setDescription("User to timeout")
                .setRequired(true))

            .addIntegerOption(option => option
                .setName("duration-hours")
                .setDescription("Number of hours to mute user")
                .setMaxValue(28)
                .setRequired(true))

            .addStringOption(option => option
                .setName("reason")
                .setDescription("Reason for the mute")))

        .addSubcommand(command => command
            .setName("remove")
            .setDescription("Removes a timeout from a user")

            .addUserOption(option => option
                .setName("target")
                .setDescription("User to remove timeout from")
                .setRequired(true))),

    execute: async (interaction: ChatInputCommandInteraction<"cached">, client: Client): Promise<void> => {
        const subcommand = interaction.options.getSubcommand();

        if (subcommand === "add") {
            const target_member = interaction.options.getMember("target")!;
            const target_user = interaction.options.getUser("target")!;
            const duration = interaction.options.getInteger("duration-hours")!;
            const reason = interaction.options.getString("reason") ?? "Not provided";

            if (target_member.id === interaction.member.id) {
                await interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle("Unable to timeout")
                            .setDescription("You can't timeout yourself silly!")
                            .setColor(0xdf2c14)
                    ]
                });

                return;
            }

            if (target_member.roles.highest.position > interaction.member.roles.highest.position) {
                await interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle("Unable to timeout")
                            .setDescription("Your role is not high enough to timeout this member")
                            .setColor(0xdf2c14)
                    ]
                });

                return;
            }

            const client_member = await interaction.guild.members.fetch(client.user!.id);
            if (target_member.roles.highest > client_member.roles.highest) {
                await interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle("Unable to timeout")
                            .setDescription("My role is not high enough to timeout this member")
                            .setColor(0xdf2c14)
                    ]
                });

                return;
            }

            await target_member.timeout(duration * 3_600_000, reason);

            await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle(`Successfully timed out ${target_user.tag}`)
                        .setDescription(`
                                Action By: ${interaction.user}
                                Target: ${target_user}
                                Duration: ${duration} hr(s)    
                                Reason: ${reason}
                            `)
                        .setColor(0x3ded97)
                ]
            });

            await target_user.send({
                embeds: [
                    new EmbedBuilder()
                        .setTitle(`You received a timeout in ${interaction.guild.name}`)
                        .setDescription(`
                                Action By: ${interaction.user}
                                Duration: ${duration} hr(s)
                                Reason: ${reason}
                            `)
                        .setColor(0xdf2c14)
                ]
            })
        }

        else if (subcommand === "remove") {
            const target_member = interaction.options.getMember("target")!;
            const target_user = interaction.options.getUser("target")!;

            if (target_member.roles.highest.position > interaction.member.roles.highest.position) {
                await interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle("Unable to remove timeout")
                            .setDescription("Your role is not high enough to remove this member's timeout")
                            .setColor(0xdf2c14)
                    ]
                });

                return;
            }

            const client_member = await interaction.guild.members.fetch(client.user!.id);
            if (target_member.roles.highest > client_member.roles.highest) {
                await interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle("Unable to remove timeout")
                            .setDescription("My role is not high enough to remove this member's timeout")
                            .setColor(0xdf2c14)
                    ]
                });

                return;
            }

            await target_member.timeout(null);

            await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle(`Successfully removed timeout`)
                        .setDescription(`
                                Action By: ${interaction.user}
                                Target: ${target_user}
                            `)
                        .setColor(0x3ded97)
                ]
            });

            await target_user.send({
                embeds: [
                    new EmbedBuilder()
                        .setTitle(`Your timeout was removed`)
                        .setDescription(`Action By: ${interaction.user}`)
                        .setColor(0xdf2c14)
                ]
            })
        }
    }
}