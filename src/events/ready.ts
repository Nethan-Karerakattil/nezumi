import { ActivityType, Client, Events, Interaction } from "discord.js"

export default {
    name: Events.ClientReady,
    once: true,

    execute: (client: Client) => {
        client.user?.setPresence({
            activities: [{
                name: "Nichijou",
                type: ActivityType.Watching
            }],

            status: "dnd"
        })

        console.log("Bot online");
    }
}