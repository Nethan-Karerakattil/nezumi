import "dotenv/config.js"
import { Client, GatewayIntentBits, Collection } from "discord.js"
import commandHandler from "./handlers/command";
import eventHandler from "./handlers/event";
import { type AudioPlayer, type VoiceConnection } from "@discordjs/voice";

if (!process.env.TOKEN) {
    throw new Error("Required Environment Variables were not defined");
}

interface Queue {
    connection: VoiceConnection,
    player: AudioPlayer,
    queue: Array<string>
}

interface Queues {
    [guildid: string]: Queue
}

declare module "discord.js" {
    interface Client {
        commands: Collection<string, any>,
        buttons: Collection<string, any>,
        queues: Queues
    }
}

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.GuildVoiceStates
    ]
});

client.commands = new Collection();
client.buttons = new Collection();
client.queues = {};

(async () => {
    await commandHandler(client);
    await eventHandler(client);
})();

client.login(process.env.TOKEN);