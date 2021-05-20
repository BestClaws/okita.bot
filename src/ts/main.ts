import HBot from "./core/HBot";

let hbot = new HBot();
hbot.configure('./config/bot-config.yml');
hbot.start();