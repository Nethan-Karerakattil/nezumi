import fs from "node:fs"
import config from "../../config.json"
import { type Client, REST, Routes } from "discord.js"

export default async function commandHandler(client: Client): Promise<void> {
    console.log("Loading commands");

    let commandArr = [];
    const commandFolders = fs.readdirSync(`${__dirname}/../commands`);
    for (const folder of commandFolders) {
        const files = fs.readdirSync(`${__dirname}/../commands/${folder}`);
        for (const file of files) {
            const command = (await import(`../commands/${folder}/${file}`)).default;

            commandArr.push(command.data.toJSON());
            client.commands.set(command.data.name, command);
        }
    }

    /* Registering Slash Commands */
    const rest = new REST().setToken(process.env.TOKEN!);

    try {
        const data = await rest.put(
            Routes.applicationGuildCommands(config.clientId, config.guildId),
            { body: commandArr }
        )
    } catch (err) {
        console.error(err);
    }

}