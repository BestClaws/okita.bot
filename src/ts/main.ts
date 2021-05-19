import * as Discord from 'discord.js';
import * as yaml from "./util/yaml";

const client = new Discord.Client();

client.on("ready", () => {
    console.log("Hu Tao is ready!");
});


let config = yaml.load("./config/bot-config.yml");

client.login(config.botToken);
