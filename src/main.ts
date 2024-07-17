import "dotenv/config.js";
import { Client, GatewayIntentBits, Collection, REST, Routes } from "discord.js";
import fs from "node:fs";
import config from "../config.json"

declare module "discord.js" {
    interface Client {
        commands: Collection<string, any>,
        buttons: Collection<string, any>
    }
}

const client = new Client({intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildPresences
]});

client.commands = new Collection();
client.buttons = new Collection();

if(!process.env.TOKEN){
    throw new Error("No token provided");
}

(async () => {
    let commandArr = [];

    /* Command Handler */
    console.log("Loading and registering slash commands");

    const commandFolders = fs.readdirSync(`${__dirname}/commands`);
    for(const folder of commandFolders){
        const files = fs.readdirSync(`${__dirname}/commands/${folder}`);
        for(const file of files){
            const command = (await import(`./commands/${folder}/${file}`)).default

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
    } catch(err){
        console.error(err);
    }

    /* Event Handler */
    console.log("Loading events");

    const eventFiles = fs.readdirSync(`${__dirname}/events`);
    for(const file of eventFiles){
        const event = (await import(`./events/${file}`)).default
    
        if(event.once){
            client.once(event.name, (...args) => event.execute(...args, client));
            continue;
        }

        client.on(event.name, (...args) => event.execute(...args, client));
    }
})();

client.login(process.env.TOKEN);