const songModal = require("../../modals/song");
const http = require("node:https");
const fs = require("node:fs");
const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, Events }
    = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("upload-song")
        .setDescription("Upload a song with this command")

        .addAttachmentOption(option => option
            .setName("song-file")
            .setDescription("Select a song to upload")
            .setRequired(true))

        .addStringOption(option => option
            .setName("song-name")
            .setDescription("Enter the song's name")
            .setRequired(true)),

    async execute(interaction, client){
        const file = interaction.options.get("song-file").attachment;
        const songName = interaction.options.getString("song-name");

        const allowedFiles = ["audio/mpeg"]
        if(!allowedFiles.includes(file.contentType))
            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle("Invalid file type")
                        .setDescription("The file must be an audio file")
                        .setColor(0xFF0000)
                ]
            })

        const message = await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setTitle("Warning!")
                    .setDescription("If you are caught uploading inappropriate content, you can be punished for it. Punishments can range from the song being removed to you being permenantly banned.")
                    .setColor(0xFF0000)
            ],
            components: [
                new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId("back")
                            .setLabel("Back")
                            .setStyle(ButtonStyle.Danger),

                        new ButtonBuilder()
                            .setCustomId("continue")
                            .setLabel("Continue")
                            .setStyle(ButtonStyle.Success)
                    )
            ]
        })

        const filter = i => i.user.id === interaction.user.id;
        const collector = message.createMessageComponentCollector({ filter, time: 15000 });

        collector.on("collect", async i => {
            switch(i.customId){
                case "back":
                    await i.update({
                        embeds: [
                            new EmbedBuilder()
                                .setTitle("Your song was not added")
                                .setDescription("Your song was not added because you clicked on back.")
                                .setColor(0xFF0000)
                        ],
                        components: []
                    })
                break;

                case "continue":
                    const songId = (new Date()).getTime().toString(36).slice(5) + Math.random().toString(36).slice(8);
                    const songExt = file.contentType.split("/")[1]

                    const songPath = `./songs/${songId}.${songExt}`;

                    const songFile = fs.createWriteStream(songPath);
                    const request = http.get(file.attachment, (response) => {
                        response.pipe(songFile);

                        songFile.on("finish", () => {
                            songFile.close();
                       });
                    });

                    const data = new songModal({
                        _id: songId,
                        song_info: {
                            song_name: songName,
                            ext: songExt,
                            verified: false
                        },
                    
                        creator_info: {
                            creator_name: interaction.user.username,
                            creator_id: interaction.user.id
                        }
                    })
                    
                    await data.save();
            
                    await i.update({
                        embeds: [
                            new EmbedBuilder()
                                .setTitle("Successfull")
                                .setDescription("Successfully uploaded the song!")
                                .setColor(0x1DB954)
                        ],
                        components: []
                    })
                break;
            }
        })
    }
}