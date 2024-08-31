import {
    type Client,
    type ChatInputCommandInteraction,
    SlashCommandBuilder,
    EmbedBuilder
} from "discord.js";

export default {
    data: new SlashCommandBuilder()
        .setName("help")
        .setDescription("Shows you the help menu"),

    execute: async (interaction: ChatInputCommandInteraction<"cached">, client: Client): Promise<void> => {

        let menu = "";
        for(const [key, value] of client.commands){
            menu += "`/" + value.data.name + "`: " + value.data.description + "\n"
        }

        await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setTitle("Here's the help menu")
                    .setDescription(menu + "\nNezumi bot is in it's beta stage, it is prone to bugs. If you find any bugs, please report it at our support server -> https://discord.gg/dBx6XWgthJ")
                    .setColor(0x625a57)
            ]
        })
    }
}