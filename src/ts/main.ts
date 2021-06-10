import XBot from "./core/XBot";

let xbot = new XBot();
xbot.configure('./config/bot-config.yml');
xbot.start();