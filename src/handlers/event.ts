import fs from "node:fs"
import { type Client } from "discord.js"

export default async function eventHandler(client: Client): Promise<void> {
    console.log("Loading events...");

    const folders = fs.readdirSync(`${__dirname}/../events`);
    for (const folder of folders) {
        const files = fs.readdirSync(`${__dirname}/../events/client`);
        for (const file of files) {
            switch (folder) {

                /* Events relating to discord client */
                case "client": {
                    const event = (await import(`../events/client/${file}`)).default;
    
                    if (event.once) {
                        client.once(event.name, (...args) => event.execute(...args, client));
                        continue;
                    }
                
                    client.on(event.name, (...args) => event.execute(...args, client));
                    break;
                }
    
                default: {
                    console.error(`Unexpected folder in events: ${folder}`);
                    break;
                }
            }
        }
    }
}