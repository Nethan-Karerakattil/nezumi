import {
    type ChatInputCommandInteraction,
    type Client,
    SlashCommandBuilder,
    PermissionsBitField,
    EmbedBuilder
} from "discord.js";
import { User } from "../../models/user";

export default {
    data: new SlashCommandBuilder()
        .setName("warn")
        .setDescription("Give, remove, or view warns of members")
        .setDefaultMemberPermissions(PermissionsBitField.Flags.ModerateMembers)
        .setDMPermission(false)

        .addSubcommand(subcommand => subcommand
            .setName("give")
            .setDescription("Warns a member")
        
            .addUserOption(option => option
                .setName("user")
                .setDescription("User to give an infraction to")
                .setRequired(true))
            
            .addStringOption(option => option
                .setName("reason")
                .setDescription("Reason for the warn")
                .setRequired(true)))

        .addSubcommand(subcommand => subcommand
            .setName("take")
            .setDescription("Removed a warn from a member")
            
            .addUserOption(option => option
                .setName("user")
                .setDescription("User to take an infraction from")
                .setRequired(true))
            
            .addIntegerOption(option => option
                .setName("warn-number")
                .setDescription("The ID of the warn")
                .setRequired(true)))

        .addSubcommand(subcommand => subcommand
            .setName("show")
            .setDescription("Shows all of a member's warns")

            .addUserOption(option => option
                .setName("user")
                .setDescription("User whos warns to see")
                .setRequired(true)))
                
        .addSubcommand(subcommand => subcommand
            .setName("clear")
            .setDescription("Clears all of a member's warns")
        
            .addUserOption(option => option
                .setName("user")
                .setDescription("User whos warns to clear")
                .setRequired(true))),

    execute: async (interaction: ChatInputCommandInteraction<"cached">, client: Client): Promise<void> => {
        const subcommand = interaction.options.getSubcommand();

        if(subcommand === "give"){
            const target_user = interaction.options.getUser("user")!;
            const target_member = interaction.options.getMember("user")!;
            const reason = interaction.options.getString("reason")!;

            if(target_user.id == interaction.user.id){
                await interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle("Unable to warn")
                            .setDescription("You can't warn yourself silly!")
                            .setColor(0xdf2c14)
                    ]
                })

                return;
            }

            if(target_member.roles.highest.position > interaction.member.roles.highest.position){
                await interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle("Unable to warn")
                            .setDescription("Your highest role is lower than the target's role.")
                            .setColor(0xdf2c14)
                    ]
                });

                return;
            }

            let db_user = await User.findOne({ uid: target_user.id});
            if(!db_user){
                db_user = await User.create({
                    uid: target_user.id,
                    warns: [{
                        action_by: interaction.user.id,
                        reason: reason
                    }]
                });
            } else {
                db_user.warns.push({
                    action_by: interaction.user.id,
                    reason: reason
                });
                await db_user.save();
            }

            await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle(`Gave a warning to ${target_user.tag}`)
                        .setDescription(`
                            Action By: ${interaction.user}
                            Target: ${target_user}
                            Reason: ${reason}

                            ${target_user} now has ${db_user!.warns.length} warning(s)
                        `)
                        .setColor(0x3ded97)
                ]
            });

            await target_user.send({
                embeds: [
                    new EmbedBuilder()
                        .setTitle("You received a warning")
                        .setDescription(`
                            Action By: ${interaction.user}
                            Reason: ${reason}
                        `)
                        .setColor(0xdf2c14)
                ]
            });

            return;
        }

        if(subcommand === "take"){
            const target_user = interaction.options.getUser("user")!;
            const target_member = interaction.options.getMember("user")!;
            const warn_id = interaction.options.getInteger("warn-id")!;
            const db_user = await User.findOne({ uid: target_user.id });

            if(target_user.id == interaction.user.id){
                await interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle("Unable to take warn")
                            .setDescription("You can't remove your own warn you sly fox!")
                            .setColor(0xdf2c14)
                    ]
                });

                return;
            }

            if(target_member.roles.highest.position > interaction.member.roles.highest.position){
                await interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle("Unable to warn")
                            .setDescription("Your highest role is lower than the target's role.")
                            .setColor(0xdf2c14)
                    ]
                });

                return;
            }

            if(!db_user || db_user.warns.length == 0){
                await interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle("Unable to remove warn")
                            .setDescription("This user doesn't have any warns to remove.")
                            .setColor(0xdf2c14)
                    ]
                });

                return;
            }

            db_user.warns.splice(warn_id, 1);
            await db_user.save();

            await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle(`Removed warning for ${target_user.tag}`)
                        .setDescription(`
                            Action By: ${interaction.user}
                            Target: ${target_user}

                            ${target_user} now has ${db_user!.warns.length} warning(s)
                        `)
                        .setColor(0x3ded97)
                ]
            });

            return;
        }

        if(subcommand === "show"){
            const target_user = interaction.options.getUser("user")!;
            let db_user = await User.findOne({ uid: target_user.id });

            if(!db_user || db_user.warns.length == 0){
                await interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle(`Warnings for ${target_user.username}`)
                            .setDescription(`${target_user} does not have any warns`)
                            .setColor(0x625a57)
                    ]
                });

                return;
            }

            let warn_fields = [];
            for(const [i, warn] of db_user.warns.entries()){
                if(i > 10) break;

                warn_fields.push({
                    name: `#${i + 1}`,
                    value: `
                        Action By: ${await client.users.fetch(warn.action_by)}
                        Reason: ${warn.reason}
                    `
                });
            }

            await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle(`Warnings for ${target_user.username}`)
                        .setDescription(`Total Warns: ${db_user.warns.length}`)
                        .setFields(warn_fields)
                        .setColor(0x625a57)
                ]
            });

            return;
        }

        if(subcommand == "clear"){
            const target_user = interaction.options.getUser("user")!;
            const target_member = interaction.options.getMember("user")!;
            const db_user = await User.findOne({ uid: target_user.id });

            if(target_user.id == interaction.user.id){
                await interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle("Unable to clear")
                            .setDescription("You can't clear your own warnings silly!")
                            .setColor(0xdf2c14)
                    ]
                });

                return;
            }

            if(target_member.roles.highest.position > interaction.member.roles.highest.position){
                await interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle("Unable to clear")
                            .setDescription("Your highest role is lower than the target's role.")
                            .setColor(0xdf2c14)
                    ]
                });

                return;
            }

            if(!db_user || db_user.warns.length == 0){
                await interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle("Unable to clear")
                            .setDescription("This user does not have any warns.")
                            .setColor(0xdf2c14)
                    ]
                });

                return;
            }

            db_user.warns = [];
            await db_user.save();

            await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle(`Cleared warnings for ${target_user.username}`)
                        .setDescription(`
                            Action By: ${interaction.user}
                            Target: ${target_user}
                        `)
                        .setColor(0x3ded97)
                ]
            });

            return;
        }
    },
}