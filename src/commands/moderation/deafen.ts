import {
    type Client,
    type ChatInputCommandInteraction,
    SlashCommandBuilder,
    EmbedBuilder,
    PermissionsBitField,
    Colors
} from "discord.js";

export default {
    data: new SlashCommandBuilder()
        .setName("deafen")
        .setDescription("Deafens/Undeafens a member in a voice channel")
        .setDefaultMemberPermissions(PermissionsBitField.Flags.DeafenMembers)

        .addSubcommand(subcommand => subcommand
            .setName("add")
            .setDescription("Deafens a member in a voice channel")

            .addUserOption(option => option
                .setName("user")
                .setDescription("User to deafen")
                .setRequired(true))

            .addStringOption(option => option
                .setName("reason")
                .setDescription("Reason for deafen (Optional)")))

        .addSubcommand(subcommand => subcommand
            .setName("remove")
            .setDescription("Undeafens a member in a voice channel")

            .addUserOption(option => option
                .setName("user")
                .setDescription("User to undeafen")
                .setRequired(true))

            .addStringOption(option => option
                .setName("reason")
                .setDescription("Reason for undeafen (Optional)"))),

    execute: async (interaction: ChatInputCommandInteraction<"cached">, client: Client): Promise<void> => {
        const target_member = interaction.options.getMember("user")!;
        const target_user = interaction.options.getUser("user")!;
        const reason = interaction.options.getString("reason") ?? "Not provided";

        switch (interaction.options.getSubcommand()) {
            case "add":
                if (!target_member.voice.channel) {
                    await interaction.reply({
                        embeds: [
                            new EmbedBuilder()
                                .setTitle("Unable to deafen")
                                .setDescription("This member is not in a voice channel")
                                .setColor(Colors.Red)
                        ]
                    });

                    return;
                }

                await target_member.voice.setDeaf(true, reason);

                await target_user.send({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle(`You have been deafended in ${interaction.guild.name}`)
                            .setDescription(`
                                Action By: ${interaction.user}
                                Reason: ${reason}
                            `)
                            .setColor(Colors.Red)
                    ]
                });

                await interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle("Successfully deafened member")
                            .setDescription(`
                                Action By: ${interaction.user}
                                Target: ${target_user}
                                Reason: ${reason}
                            `)
                            .setColor(Colors.Green)
                    ]
                });

                break;

            case "remove":
                if (!target_member.voice.channel) {
                    await interaction.reply({
                        embeds: [
                            new EmbedBuilder()
                                .setTitle("Unable to undeafen")
                                .setDescription("This member is not in a voice channel")
                                .setColor(Colors.Red)
                        ]
                    });

                    return;
                }

                await target_member.voice.setDeaf(false, reason);

                await target_user.send({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle(`You have been undeafended in ${interaction.guild.name}`)
                            .setDescription(`
                                Action By: ${interaction.user}
                                Reason: ${reason}
                            `)
                            .setColor(Colors.Green)
                    ]
                });

                await interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle("Successfully undeafened member")
                            .setDescription(`
                                Action By: ${interaction.user}
                                Target: ${target_user}
                                Reason: ${reason}
                            `)
                            .setColor(Colors.Green)
                    ]
                });

                break;
        }
    }
}