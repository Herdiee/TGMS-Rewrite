// Dependencies
const chalk = require('chalk');

module.exports = (client) => {
    console.log(chalk.cyan('I am ready to serve you!'));
    console.log(chalk.cyan(`serving ${client.guilds.cache.size} servers`));
    client.user.setPresence({
        status: 'available',
        activity: {
            name: 'Old, Better top gear',
            type: 'STREAMING',
            url: 'https://www.youtube.com/watch?v=iik25wqIuFo'
        }
    })
};
