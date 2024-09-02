import {
    type ChatInputCommandInteraction,
    type Client,
    Colors,
    PermissionsBitField,
    SlashCommandBuilder,
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    MessageComponentInteraction
} from "discord.js";

export default {
    data: new SlashCommandBuilder()
        .setName("lockdown")
        .setDescription("Locks/unlocks all channels in the server")
        .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator)

        .addSubcommand(subcommand => subcommand
            .setName("add")
            .setDescription("Locks all channels in the server")

            .addStringOption(option => option
                .setName("reason")
                .setDescription("Reason for lockdown (Optional)")))

        .addSubcommand(subcommand => subcommand
            .setName("remove")
            .setDescription("Unlocks all channels in the server")),

    execute: async (interation: ChatInputCommandInteraction<"cached">, client: Client): Promise<void> => {
        switch (interation.options.getSubcommand()) {
            case "add":
                const response = await interation.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle("Are you sure?")
                            .setDescription(`
                                Putting the server will result in the following:-
                                * Members will be unable to chat in any text channel (Except for admin & other previledged roles)\n* Members will be unable to connect to any voice channel (Except for admin & other previledged roles)\nThis command is meant to be used only for when there is excessive spamming in the server.
                            `)
                            .setColor(Colors.Red)
                    ],

                    components: [
                        new ActionRowBuilder<ButtonBuilder>()
                            .addComponents(
                                new ButtonBuilder()
                                    .setCustomId("confirm")
                                    .setLabel("Confirm")
                                    .setStyle(ButtonStyle.Success),

                                new ButtonBuilder()
                                    .setCustomId("cancel")
                                    .setLabel("Cancel")
                                    .setStyle(ButtonStyle.Danger)
                            )
                    ]
                });

                try {
                    handle_confirmation(await response.awaitMessageComponent({
                        filter: (i) => i.user.id === interation.user.id,
                        time: 60_000
                    }), interation);
                } catch (err) {
                    await interation.editReply({
                        embeds: [
                            new EmbedBuilder()
                                .setTitle("Confirmation not recieved")
                                .setDescription("Confirmation was not recieved in 60 seconds. Action was cancelled.")
                                .setColor(Colors.Red)
                        ],

                        components: []
                    });
                }

                break;

            case "remove":
                const channels = await interation.guild.channels.fetch();

                /* Enable messages in all channels */
                for (const [key, channel] of channels) {
                    if (channel!.isTextBased()) {
                        await channel.permissionOverwrites.edit(interation.guild.roles.everyone, {
                            SendMessages: true,
                            AttachFiles: true,
                            Connect: true
                        });

                        await channel.send({
                            embeds: [
                                new EmbedBuilder()
                                    .setTitle("Lockdown lifted")
                                    .setDescription(`
                                        The lockdown has been lifted. Thanks for your patience!

                                        Action By: ${interation.user}
                                    `)
                                    .setColor(Colors.Green)
                            ]
                        });
                    }
                }

                /* Success message */
                await interation.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle("Lockdown lifted successfully")
                            .setDescription("The lockdown has been lifted successfully!")
                            .setColor(Colors.Green)
                    ]
                });

                break;
        }
    }
}

async function handle_confirmation (confirmation: MessageComponentInteraction, interation: ChatInputCommandInteraction<"cached">): Promise<void> {
    switch (confirmation.customId) {
        case "confirm":
            const reason = interation.options.getString("reason") ?? "Not provided";
            const channels = await interation.guild.channels.fetch();

            await interation.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle("Initiating Lockdown...")
                        .setColor(Colors.Green)
                ],
                components: []
            });

            for (const [key, channel] of channels) {
                /* Disable messages in all channels */
                if (channel!.isTextBased()) {
                    await channel.permissionOverwrites.edit(interation.guild.roles.everyone, {
                        SendMessages: false,
                        AttachFiles: false,
                        Connect: false
                    });

                    await channel.send({
                        embeds: [
                            new EmbedBuilder()
                                .setTitle("This server is in a lockdown")
                                .setDescription(`
                                    This server is in a temporary lockdown. Please be patient while the mods fix the issue.

                                    Action By: ${interation.user}
                                    Reason: ${reason}
                                `)
                                .setColor(Colors.Red)
                        ]
                    });
                }

                /* Kick all members in a voice channel */
                if (channel!.isVoiceBased()) {
                    for (const [key, member] of channel.members) {
                        await member.voice.disconnect();
                    }
                }
            }

            /* Success message */
            await interation.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle("Server lockdown successful")
                        .setDescription("To undo this, use `/lockdown remove`")
                        .setColor(Colors.Green)
                ]
            });
            break;

        case "cancel":
            await interation.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle("Lockdown successfully cancelled")
                        .setDescription("*Whew!* That was a close one!")
                        .setColor(Colors.Green)
                ],
                components: []
            })
            break;
    }
}