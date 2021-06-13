import Discord from "discord.js";
import * as yaml from "../util/yaml";
import ModuleManager from "./ModuleManager";
import * as dbObjects from "../db/db-objects";


export default class SBot {
    
    botConfig: any = {};
    db = dbObjects;
    dClient: Discord.Client = new Discord.Client();
    modules: any = [];
    services: any = [];
    moduleManager: ModuleManager = new ModuleManager(this);
    


    constructor() {}

    configure(configFile: string) {
        this.botConfig = yaml.load(configFile);
    }


    start() {
        this.dClient.on("ready", () => {
            
            // Set the client user's activity [listening to *help]
            let activity_msg = this.botConfig.defaultPrefix + "help";
            this.dClient.user!.setActivity(activity_msg, { type: "LISTENING" })
                .then(presence => 
                    console.log(`Activity set to ${presence.activities[0].name}`)
                ).catch(console.error);

            this.moduleManager.start();
        });
        
        this.dClient.login(this.botConfig.botToken);
    }
}

