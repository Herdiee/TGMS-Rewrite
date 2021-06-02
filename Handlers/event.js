const fs = require("fs");
const chalk = require('chalk');

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