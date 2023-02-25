const { EmbedBuilder, SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle }
    = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("invite")
        .setDescription("Shows you the link to invite this bot to your server!"),

    async execute(interaction, client){
        await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setTitle("How to invite me")
                    .setDescription('Step 1: Click on the "invite" button below\nStep 2: Select the server you want me in\nStep 3: Give me the permissions you want me to have\nStep 4: Click on "Authorize"')
                    .setColor(0x7289da)
            ],
            components: [
                new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setLabel("Invite")
                            .setStyle(ButtonStyle.Link)
                            .setURL("https://discord.com/api/oauth2/authorize?client_id=916599817818497044&permissions=8&scope=bot")
                    )
            ]
        })
    }
}