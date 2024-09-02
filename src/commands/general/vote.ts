import {
    type ChatInputCommandInteraction,
    type Client,
    SlashCommandBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    EmbedBuilder,
    ButtonStyle,
    Colors
} from "discord.js";

export default {
    data: new SlashCommandBuilder()
        .setName("vote")
        .setDescription("Takes you to the vote page"),

    execute: async (interaction: ChatInputCommandInteraction, client: Client): Promise<void> => {
        await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setTitle("Vote for Nezumi")
                    .setDescription("Hey, voting can help us grow and reach more people! You can vote by clicking on the button below.")
                    .setColor(Colors.LuminousVividPink)
            ],
            components: [new ActionRowBuilder<ButtonBuilder>({
                components: [
                    new ButtonBuilder({
                        label: "top.gg",
                        url: "https://top.gg/bot/916599817818497044",
                        style: ButtonStyle.Link
                    }),

                    new ButtonBuilder({
                        label: "Discord Bot List",
                        url: "https://top.gg/bot/916599817818497044",
                        style: ButtonStyle.Link
                    })
                ]
            })]
        });
    }
}
