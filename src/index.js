console.log("Starting the application...")
require("dotenv").config();

const { Collection, Client } = require("discord.js");
const mongoose = require("mongoose");
const fs = require("node:fs");
const config = require("../config.json");

const client = new Client({ intents: 98045 });

client.commands = new Collection();
client.buttons = new Collection();
client.queues = new Collection();
client.commandsArr = [];

client.queues.set("something", "awesome value")

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