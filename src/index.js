const Discord = require('discord.js');
const bot = new Discord.Client();
require('dotenv').config();
const fs = require('fs');

const prefix = process.env.PREFIX;
const token = process.env.TOKEN;

bot.commands = new Discord.Collection();

bot.on('ready', () => {
    console.log('Bot online');

    fs.readdir('./src/commands', (err, files) => {
        if (err) return console.log(err);

        const jsfile = files.filter((f) => f.endsWith('.js'));

        if (jsfile.length <= 0) return console.log('Could not find commands!');

        jsfile.forEach((f) => {
            const props = require(`./commands/${f}`);
            bot.commands.set(props.help.name, props);
        });
    });
});

bot.on('message', (message) => {
    if (
        message.author.bot ||
        message.channel.type !== 'text' ||
        !message.content.startsWith(prefix)
    )
        return;
    // hello there ['hello', 'there']
    // !ban user reason ['user', 'reason']
    // Breaking Rules ['breaking', 'rules'] breaking rules
    // hello
    const MessageArray = message.content.split(' ');
    const cmd = MessageArray[0].slice(prefix.length);
    const args = MessageArray.slice(1);

    const commandfile = bot.commands.get(cmd);
    if (commandfile) {
        commandfile.run(message, args);
    }
});

bot.login(token);
