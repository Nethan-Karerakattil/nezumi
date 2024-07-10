import { ActivityType, Client, Events, PresenceUpdateStatus } from "discord.js"

export default {
    name: Events.ClientReady,
    once: true,

    execute: (client: Client) => {
        client.user?.setPresence({
            activities: [{
                name: "Nichijou",
                type: ActivityType.Watching
            }],

            status: PresenceUpdateStatus.DoNotDisturb
        })

        console.log("Bot online");
    }
}