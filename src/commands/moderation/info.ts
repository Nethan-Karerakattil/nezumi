import {
    type ChatInputCommandInteraction,
    type Client,
    EmbedBuilder,
    SlashCommandBuilder,
    SlashCommandUserOption
} from "discord.js";

export default {
    data: new SlashCommandBuilder()
        .setName("info")
        .setDescription("Get information on this server, members, and roles in this server")
        .setDMPermission(false)

        .addSubcommand(subcommand => subcommand
            .setName("server")
            .setDescription("Get information on this server"))

        .addSubcommand(subcommand => subcommand
            .setName("member")
            .setDescription("Get information on a member in this server")

            .addUserOption(option => option
                .setName("member")
                .setDescription("The member to find information about")))

        .addSubcommand(subcommand => subcommand
            .setName("role")
            .setDescription("Get information on a role in this server")

            .addRoleOption(option => option
                .setName("role")
                .setDescription("The role to find information about")
                .setRequired(true))),

    execute: async (interaction: ChatInputCommandInteraction<"cached">, client: Client): Promise<void> => {
        const subcommand = interaction.options.getSubcommand();

        if (subcommand === "server") {
            subcommand_server(interaction, client);
            return;
        }

        if (subcommand === "member") {
            subcommand_member(interaction, client);
            return;
        }

        if (subcommand === "role") {
            subcommand_role(interaction, client);
            return;
        }
    }
}

async function subcommand_server(interaction: ChatInputCommandInteraction<"cached">, client: Client): Promise<void> {
    const user_avatar = interaction.user.avatarURL() ?? "https://cdn.discordapp.com/embed/avatars/0.png";
    const owner = await client.users.fetch(interaction.guild.ownerId);

    await interaction.reply({
        embeds: [
            new EmbedBuilder()
                .setThumbnail(user_avatar)
                .setAuthor({
                    name: `Server Info for ${interaction.guild.name}`,
                    iconURL: user_avatar
                })
                .addFields(
                    {
                        name: "Owner:",
                        value: owner.toString(),
                        inline: true
                    },

                    {
                        name: "Member Count:",
                        value: `${interaction.guild.memberCount} members`,
                        inline: true
                    },

                    {
                        name: "Created At:",
                        value: `<t:${Math.round(interaction.guild.createdTimestamp / 1000)}>`
                    }
                )
                .setFooter({ text: `Requested by: ${interaction.user.tag}` })
                .setColor(0x625a57)
        ]
    });
}

async function subcommand_member(interaction: ChatInputCommandInteraction<"cached">, client: Client): Promise<void> {
    const target_member = interaction.options.getMember("member") ?? interaction.member;
    const target_user = interaction.options.getUser("member") ?? interaction.user;
    const user_avatar = target_user.avatarURL() ?? "https://cdn.discordapp.com/embed/avatars/0.png";

    await interaction.reply({
        embeds: [
            new EmbedBuilder()
                .setAuthor({
                    name: `User info for ${target_user.tag}`,
                    iconURL: user_avatar
                })
                .setThumbnail(user_avatar)
                .addFields(
                    {
                        name: "User:",
                        value: target_user.toString(),
                        inline: true
                    },
                    {
                        name: "User Status:",
                        value: target_member.presence?.status ?? "offline",
                        inline: true
                    },
                    {
                        name: "Account Created:",
                        value: `<t:${Math.round(target_user.createdTimestamp / 1000)}>`
                    },
                    {
                        name: "Joined Server:",
                        value: `<t:${Math.round(target_member.joinedTimestamp! / 1000)}>`
                    }
                )
                .setFooter({ text: `Requested by: ${interaction.user.tag}` })
                .setColor(0x625a57)
        ]
    });
}

async function subcommand_role(interaction: ChatInputCommandInteraction<"cached">, client: Client): Promise<void> {
    const user_avatar = interaction.user.avatarURL() ?? "https://cdn.discordapp.com/embed/avatars/0.png";
    const target_role = interaction.options.getRole("role")!;

    await interaction.reply({
        embeds: [
            new EmbedBuilder()
                .setAuthor({
                    name: `Role info for ${target_role.name}`,
                    iconURL: user_avatar
                })
                .setThumbnail(user_avatar)
                .addFields(
                    {
                        name: "Role:",
                        value: target_role.toString(),
                        inline: true
                    },
                    {
                        name: "Rank:",
                        value: target_role.position.toString(),
                        inline: true
                    },
                    {
                        name: "Created:",
                        value: `<t:${Math.round(target_role.createdTimestamp / 1000)}>`
                    }
                )
                .setFooter({ text: `Requested by: ${interaction.user.tag}` })
                .setColor(target_role.color)
        ]
    });
}