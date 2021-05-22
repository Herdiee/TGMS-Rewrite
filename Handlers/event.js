const fs = require("fs");                                       // Javascript File System
const chalk = require('chalk');                                 // Colored Terminal

module.exports = (client) => {
    fs.readdir(`./events/`, (err, files) => {
        if (err) return console.error(err);
        files.forEach(file => {
          const event = require(`../events/${file}`);
          console.log(chalk.green(`Loading Event ${file}`));
          let eventName = file.split(".")[0];
          client.on(eventName, event.bind(null, client));
        })
    })
}