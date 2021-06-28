import { Message, ReactionCollector } from "discord.js";
import Module from "../core/Module";
import SBot from "../core/SBot";

export default class Albums extends Module {

    commandName = "isave";
    enabled = true;
    state: any;


    constructor(sbot: SBot) {
        super(sbot);
    }

    async processCommand(msg: Message, args: String[]) {

        let requestor_id = msg.author.id;
        let album_name = args[0] ||  "default";

        // only allow in shrine
        if(msg.channel.id != "794137845182365716") return;

        let saved_images: string[] = [];

        let latestCollector: ReactionCollector | null =  null;

        let responded = false;
        
        // fetch last 20 messages.
        let messages = await msg.channel.messages.fetch({limit: 20});
        for(let message of messages.array()) {
            // see if message contains image
            let mcontent = message.content;
            if( // TODO: maybe make a util function that identifies file types, given remote urls
                mcontent.startsWith("https://i.imgur.com/") ||
                mcontent.startsWith("https://cdn.discordapp.com")
            ) {
                // image found
                this.log("found image:", mcontent);

                // give it a reaction, and registered callback to save image to album
                message.react("💾");

                let collector = message.createReactionCollector((reaction, user) => {                    
                    return ["💾"].includes(reaction.emoji.name) &&
                        (user.id == requestor_id);
                }, {time: 10000});

                latestCollector = collector;

                collector.on('collect', (reaction, user) => 
                    saved_images.push(mcontent)
                );


                collector.on('end', collected => 
                    collected.forEach((reaction, key, map) => reaction.remove())
                );

                
            }
        }

        if(latestCollector)
        latestCollector.on('end', collected => {
            
            this.log("final collector ended");
            for(let image of saved_images) {
                this.sbot.db.Albums.create({
                    user_id: requestor_id,
                    image_url: image,
                    album_name: album_name
                }).then(() => {
                    this.log("added info", requestor_id, image, album_name);
                });

            }

            msg.channel.send(`${saved_images.length} images added to album: ${album_name}.\n checkout: http://insomnia247.nl:5300/albums/${requestor_id}/${album_name}`);
        });
    }
}