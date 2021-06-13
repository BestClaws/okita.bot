import SBot from "./core/SBot";

let sbot = new SBot();
sbot.configure('./config/bot-config.yml');
sbot.start();