import { Client, ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } from "discord.js";

export default {
    data: new SlashCommandBuilder()
        .setName("help")
        .setDescription("Shows you the help menu"),

    execute: async (interaction: ChatInputCommandInteraction, client: Client) => {

        let menu = "";
        for(const [key, value] of client.commands){
            console.log(value.data.name);
            console.log(value.data.description);

            menu += "`/" + value.data.name + "`: " + value.data.description + "\n"
        }

        await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setTitle("Here's the help menu")
                    .setDescription(menu)
            ]
        })
    }
}