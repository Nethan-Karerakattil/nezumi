const fs = require("node:fs");

module.exports = (client) => {
    client.handleEvents = async () => {

        const folders = fs.readdirSync("./src/events");
        for(const folder of folders){
            const files = fs.readdirSync(`./src/events/${folder}`);
            for(const file of files){
                switch(folder){
                    case "client":
                        const event = require(`../../events/${folder}/${file}`);

                        if(event.once){
                            client.once(event.name, (...args) => event.execute(...args, client));
                        }else {
                            client.on(event.name, (...args) => event.execute(...args, client));
                        }
                    break;
                }
            }
        }

        console.log("Successfully registered events")
    }
}