import "dotenv/config.js"
import mongoose from "mongoose"
import { Client, GatewayIntentBits, Collection } from "discord.js"
import commandHandler from "./handlers/command";
import eventHandler from "./handlers/event";

if(!process.env.TOKEN || !process.env.DB_URI){
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
    console.log("Connecting to database");
    await mongoose.connect(process.env.DB_URI!);

    await commandHandler(client);
    await eventHandler(client);
})();

client.login(process.env.TOKEN);