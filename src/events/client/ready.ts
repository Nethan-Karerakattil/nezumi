import {
    type Client,
    PresenceUpdateStatus,
    ActivityType,
    Events
} from "discord.js"

export default {
    name: Events.ClientReady,
    once: true,

    execute: (client: Client): void => {
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