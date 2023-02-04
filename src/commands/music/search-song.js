const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const songModal = require("../../modals/song");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("search-songs")
        .setDescription("Shows you a list of all the songs you can listen to")
        
        .addStringOption(option => option
            .setName("song-name")
            .setDescription("Name of the song you want to listen to (Optional)")),

    async execute(interaction, client){
        const query = interaction.options.getString("song-name");

        const execute = async (err, data) => {
            if(err) {
                console.log(err);

                return await interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle("Error: 500")
                            .setDescription("Something went wrong when trying to look for the song")
                            .setColor(0xff0000)
                    ]
                })
            }

            let results = [];
            for(let i = 0; i < data.length; i++){
                results.push({
                    name: `#${i + 1} | ${data[i].song_info.song_name}`,
                    value: `    By: ${data[i].creator_info.creator_name} | ID: ${data[i]._id}`
                })
            }

            return await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle("Top results:-")
                        .addFields(results)
                        .setColor(0x1DB954)
                ]
            })
        }

        if(query) songModal.find({ "song_info.song_name": query}, (err, data) => execute(err, data));
        else songModal.find({  }, (err, data) => execute(err, data));
    }
}