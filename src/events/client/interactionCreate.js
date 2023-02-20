const { EmbedBuilder, Events } = require("discord.js");

module.exports = {
    name: Events.InteractionCreate,

    async execute(interaction, client){
        if(interaction.isChatInputCommand()){
            const command = client.commands.get(interaction.commandName);

            if(!interaction.commandName) return console.log("Unable to find this command");

            try {
                await command.execute(interaction, client);
            }catch(err){
                console.error(err);

                return await interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle("Something went wrong")
                            .setDescription("Something went wrong when trying to execute this command")
                            .setColor(0xff0000)
                    ]
                })
            }
        }
    }
}