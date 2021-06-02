const fs = require("fs");
const chalk = require('chalk');

module.exports = (client) => {
    fs.readdirSync(`./commands/`).forEach(dir => {
        const commands = fs.readdirSync(`./commands/${dir}`).filter(file => file.endsWith('.js')); 
        for (const file of commands) {
            let command = require(`../commands/${dir}/${file}`);
            console.log(chalk.green(`Loading command ${file}`));
            let commandName = file.split(".")[0];
            let props = require(`../commands/${dir}/${file}`);
            client.commands.set(commandName, props)
        }
    })
}