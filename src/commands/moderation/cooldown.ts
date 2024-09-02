import {
    type ChatInputCommandInteraction,
    type Client,

    type NewsChannel,
    type StageChannel,
    type TextChannel,
    type PrivateThreadChannel,
    type VoiceChannel,
    type ForumChannel,
    type MediaChannel,
    type PublicThreadChannel,

    ChannelType,
    PermissionsBitField,
    SlashCommandBuilder,
    EmbedBuilder,
    Colors
} from "discord.js";

export default {
    data: new SlashCommandBuilder()
        .setName("cooldown")
        .setDescription("Sets or removes a cooldown on a particular channel")
        .setDefaultMemberPermissions(PermissionsBitField.Flags.ManageChannels)
        .setDMPermission(false)

        .addSubcommand(subcommand => subcommand
            .setName("set")
            .setDescription("Sets a cooldown on a particular channel")

            .addChannelOption(option => option
                .setName("channel")
                .setDescription("Channel to apply the cooldown to")
                .setRequired(true)
                .addChannelTypes([
                    ChannelType.GuildText,
                    ChannelType.GuildVoice,
                    ChannelType.GuildForum,
                    ChannelType.GuildMedia,
                    ChannelType.PrivateThread,
                    ChannelType.PublicThread,
                    ChannelType.GuildStageVoice
                ]))

            .addIntegerOption(option => option
                .setName("cooldown")
                .setDescription("The number of seconds of cooldown per user")
                .setRequired(true))

            .addStringOption(option => option
                .setName("reason")
                .setDescription("The reason for doing this (Optional)")))

        .addSubcommand(subcommand => subcommand
            .setName("remove")
            .setDescription("Removes a cooldown from a channel")

            .addChannelOption(option => option
                .setName("channel")
                .setDescription("Channel to remove the cooldown from")
                .setRequired(true)
                .addChannelTypes([
                    ChannelType.GuildText,
                    ChannelType.GuildVoice,
                    ChannelType.GuildForum,
                    ChannelType.GuildMedia,
                    ChannelType.PrivateThread,
                    ChannelType.PublicThread,
                    ChannelType.GuildStageVoice
                ]))

            .addStringOption(option => option
                .setName("reason")
                .setDescription("The reason for doing this (Optional)"))),

    execute: async (interaction: ChatInputCommandInteraction<"cached">, client: Client) => {
        const subcommand = interaction.options.getSubcommand();

        if (subcommand === "set") {
            const target_channel = interaction.options.getChannel("channel")! as NewsChannel | StageChannel | TextChannel | PrivateThreadChannel | VoiceChannel | ForumChannel | MediaChannel | PublicThreadChannel;
            const cooldown = interaction.options.getInteger("cooldown")!;
            const reason = interaction.options.getString("reason") ?? "Not provided";

            target_channel.setRateLimitPerUser(cooldown, reason);

            await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle(`Set cooldown for #${target_channel.name}`)
                        .setDescription(`
                            Action By: ${interaction.user}
                            Channel Effected: <#${target_channel.id}>
                            New Cooldown: ${cooldown}
                            Reason: ${reason}
                        `)
                        .setColor(Colors.Green)
                ]
            });

            return;
        }

        if (subcommand === "remove") {
            const target_channel = interaction.options.getChannel("channel")! as NewsChannel | StageChannel | TextChannel | PrivateThreadChannel | VoiceChannel | ForumChannel | MediaChannel | PublicThreadChannel;
            const reason = interaction.options.getString("reason") ?? "Not provided";

            target_channel.setRateLimitPerUser(0, reason);

            await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle(`Removed cooldown for #${target_channel.name}`)
                        .setDescription(`
                            Action By: ${interaction.user}
                            Channel Effected: <#${target_channel.id}>
                            Reason: ${reason}
                        `)
                        .setColor(Colors.Green)
                ]
            });

            return;
        }
    }
}