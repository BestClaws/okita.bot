import Discord from "discord.js";
import * as yaml from "../util/yaml";
import ModuleManager from "./ModuleManager";



export default class HBot {
    botConfig: any = {};
    dClient: Discord.Client = new Discord.Client();
    modules: any = [];
    services: any = [];
    moduleManager: ModuleManager = new ModuleManager(this);


    constructor() {


    }

    /**
     * configure the bot using the bot config file
     * @param {string} configFile 
     */
    configure(configFile: string) {
        this.botConfig = yaml.load(configFile);
    }


    start() {
        this.dClient.on("ready", () => {
            
            // Set the client user's activity
            if(this.dClient.user) this.dClient.user.setActivity(".help", { type: "LISTENING" })
                .then(presence => console.log(`Activity set to ${presence.activities[0].name}`))
                .catch(console.error);

            this.moduleManager.start();
        });
        
        this.dClient.login(this.botConfig.botToken);
    }
}

