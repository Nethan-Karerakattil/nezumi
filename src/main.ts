import "dotenv/config.js"
import { Client, GatewayIntentBits, Collection } from "discord.js"
import commandHandler from "./handlers/command";
import eventHandler from "./handlers/event";

if(!process.env.TOKEN){
    throw new Error("Required Environment Variables were not defined");
}

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

(async () => {
    await commandHandler(client);
    await eventHandler(client);
})();

client.login(process.env.TOKEN);