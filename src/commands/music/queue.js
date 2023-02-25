const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");
const songModal = require("../../modals/song");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("queue")
        .setDescription("Shows you the current queue"),

    async execute(interaction, client){
        const queue = client.queues.get(interaction.guild.id);
        console.log(queue)

        let message = []
        for(let i = 0; i < queue.length; i++){
            message.push({
                name: `#${i + 1} | ${queue[i].song_info.song_name}`,
                value: `Uploaded By: ${queue[i].creator_info.creator_name} | ID: ${queue[i]._id}`
            })
        }

        await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setTitle("Current Queue:-")
                    .addFields(message)
                    .setColor(0x7289da)
            ]
        })
    }
}