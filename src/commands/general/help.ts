import {
    type Client,
    type ChatInputCommandInteraction,
    SlashCommandBuilder,
    EmbedBuilder,
    Colors
} from "discord.js";

import fs from "node:fs";

export default {
    data: new SlashCommandBuilder()
        .setName("help")
        .setDescription("Shows you the help menu"),

    execute: async (interaction: ChatInputCommandInteraction<"cached">, client: Client): Promise<void> => {
        const menu = new EmbedBuilder().setTitle("Here is the help menu!").setColor(Colors.Green)
        const folders = fs.readdirSync("./src/commands");

        for (const folder of folders) {
            const files = fs.readdirSync(`./src/commands/${folder}`);

            let value = "";
            for (const file of files) {
                value += "`/" + file.replace(/\.[^/.]+$/, "") + "`\n";
            }

            menu.addFields({
                name: folder,
                value: value,
                inline: true
            })
        }

        await interaction.reply({
            embeds: [menu]
        })
    }
}