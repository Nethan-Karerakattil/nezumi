require("dotenv").config();

const discord = require("discord.js");
const mongoose = require("mongoose");
const fs = require("node:fs");
const config = require("../config.json");

const client = new discord.Client({ intents: 98045 });

client.commands = new discord.Collection();
client.buttons = new discord.Collection();
client.commandsArr = [];

const handlers = fs.readdirSync("./src/structures/handlers");
for(const handler of handlers){
    require(`./structures/handlers/${handler}`)(client);
}

mongoose.set("strictQuery", false);
mongoose.connect(config.db_uri)
    .catch(err => console.log(err))
    .then(console.log("Successfully connected to database"))

client.handleCommands();
client.handleEvents();

client.login(process.env.TOKEN)