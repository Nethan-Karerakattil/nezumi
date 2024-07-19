import fs from "node:fs"
import { type Client } from "discord.js"

export default async function eventHandler(client: Client): Promise<void> {
    console.log("Loading events");

    const eventFiles = fs.readdirSync(`${__dirname}/../events`);
    for(const file of eventFiles){
        const event = (await import(`../events/${file}`)).default
    
        if(event.once){
            client.once(event.name, (...args) => event.execute(...args, client));
            continue;
        }

        client.on(event.name, (...args) => event.execute(...args, client));
    }
}