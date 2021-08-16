import {Message} from "discord.js";
import SBot from "../core/SBot";
import Module from "../core/Module";





export default class MusicPlayer extends Module {
    commandName = "player";
    dispatcher: any;   
    connection: any;
    constructor(sbot: SBot) {
        super(sbot);
    }

    async processCommand(msg: Message, args: String[]) {

        let subcmd = args[0];


        switch(subcmd) {


            case "play":
                
                let url = args[1];
                let channelid = '744209394358812727'; // weebs
        
                let voiceChannel: any = msg.client.channels.cache.get(channelid);
                this.connection = await voiceChannel!.join();
            
                msg.channel.send("playing: " + url);
    	        this.dispatcher = this.connection.play(url);
                break;
            
            case "pause":
                this.dispatcher.pause();
                msg.channel.send("playback paused.")
                return;
            
            case "resume":
                if(this.dispatcher) {

                    msg.channel.send("resuming playback.");
                    this.dispatcher.resume();
                    this.dispatcher.pause();
                    this.dispatcher.resume();
                }
                
                return;
            case "stop":
                this.connection.disconnect();
                msg.channel.send("music stopped.")
                return;
            default:
                msg.channel.send("invalid sub command.");


        }


    }

  

}
