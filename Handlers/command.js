const fs = require("fs");                   // Javascript File System
const chalk = require('chalk');             // Colored Terminal

module.exports = (client) => {
    fs.readdirSync(`./commands/`).forEach(dir => {
        const commands = fs.readdirSync(`./commands/${dir}`).filter(file => file.endsWith('.js'));      // Filter files by ending
        for (const file of commands) {                                                                  // Iterate through files
            let command = require(`../commands/${dir}/${file}`);
            console.log(chalk.green(`Loading command ${file}`));
            let commandName = file.split(".")[0];
            let props = require(`../commands/${dir}/${file}`);
            client.commands.set(commandName, props)
        }
    })
}