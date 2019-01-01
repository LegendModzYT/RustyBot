const Discord = require("discord.js");
const client = new Discord.Client();
const { promisify } = require("util");
const readdir = promisify(require("fs").readdir);
const cron = require('node-cron');
require(`./modules/embeds`)(client)
client.moment = require("moment");


cron.schedule('* * * * *', () => {
    // Cron Job
});

client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();

// Require Congigs, Functions and Modules
client.settings = {} = require("./config.js");
menu = require("./modules/embedMenus")
require("./modules/functions.js")(client);
require("./modules/databases.js")(client)
client.logger = require("./modules/logger");

menu.init()

const init = async () => {

    // Logs Demo
    client.logger.log("Standard Log Demo")
    client.logger.warn("Warn Log Demo")
    client.logger.error("Error Log Demo")
    client.logger.debug("Debug Log Demo")
    client.logger.cmd("cmd Log Demo")
    client.logger.ready("Ready Log Demo")
    client.logger.loaded("loaded Log Demo")

    console.log("\n\n          ============\n              Logs\n          ============\n")

    // Load Commands
    const cmdFiles = await readdir("./commands/");
    client.logger.log(`Loading a total of ${cmdFiles.length} commands.`);
    cmdFiles.forEach(file => {
        if (!file.endsWith(".js")) return;
        const response = client.loadCommand(file);
        if (response) console.log(response);
    });

    // Then we load events, which will include our message and ready event.
    const evtFiles = await readdir("./events/");
    client.logger.log(`Loading a total of ${evtFiles.length} events.`);
    evtFiles.forEach(file => {
        const eventName = file.split(".")[0];
        client.logger.loaded(`Loading Event: ${eventName}`);
        const event = require(`./events/${file}`);
        client.on(eventName, event.bind(null, client));
    });

    // Generate a cache of client permissions for pretty perm names in commands.
    client.levelCache = {};
    for (let i = 0; i < client.settings.permLevels.length; i++) {
        const thisLevel = client.settings.permLevels[i];
        client.levelCache[thisLevel.name] = thisLevel.level;
    }

    client.login(client.settings.token);
    require("./routes/apiRoutes")(client)
    // client.updateStats()
}

init()
