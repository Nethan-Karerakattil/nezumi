import "dotenv/config.js";
import { Client, GatewayIntentBits, Collection, REST } from "discord.js";
import fs from "node:fs";

declare module "discord.js" {
    interface Client {
        commands: Collection<string, any>,
        buttons: Collection<string, any>
    }
}

const client = new Client({intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
]});

client.commands = new Collection();
client.buttons = new Collection();

(async () => {
    let commandArr = [];

    const commandFolders = fs.readdirSync(`${__dirname}/commands`);
    for(const folder of commandFolders){
        const files = fs.readdirSync(`${__dirname}/commands/${folder}`);
        for(const file of files){
            const command = (await import(`./commands/${folder}/${file}`)).default

            commandArr.push(command.data.toJSON());
            client.commands.set(command.data.name, command);
        }
    }

    const rest = new REST({ version: "10" }).setToken(process.env.TOKEN!);

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