const { Events, EmbedBuilder } = require("discord.js");
const { getVoiceConnection } = require("@discordjs/voice");

module.exports = {
    name: Events.VoiceStateUpdate,

    execute(interaction, client){
        const vc = interaction.guild.members.me.voice.channel;
        if(!vc) return;

        if(vc.members.size == 1) {
            setTimeout(async () => {
                if(!vc.members.size == 1) return;

                getVoiceConnection(interaction.guild.id).disconnect()
            }, 10000)
        }
    }
}