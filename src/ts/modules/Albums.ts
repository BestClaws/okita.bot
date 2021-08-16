import { Message, ReactionCollector, MessageEmbed } from "discord.js";
import Module from "../core/Module";
import SBot from "../core/SBot";

export default class Albums extends Module {

    commandName = "isave";
    state: any;


    constructor(sbot: SBot) {
        super(sbot);
    }

    async processCommand(msg: Message, args: String[]) {

        let requestor_id = msg.author.id;
        let album_name = args[0] ||  "Default";

        // only allow in shrine
        // if(msg.channel.id != "794137845182365716") return;

        msg.delete();
        let saved_images: string[] = [];

        let latestCollector: ReactionCollector | null =  null;

        let responded = false;

        // fetch last 20 messages.
        let messages = await msg.channel.messages.fetch({limit: 20});


        
        for(let message of Array.from(messages.values())) {
            // see if message contains image
            
            let image_url: string | undefined = undefined;


            // this.log("checking for urls in message: ", message.id);

            if( // TODO: maybe make a util function that identifies file types, given remote urls
                message.content.startsWith("https://i.imgur.com/") ||
                message.content.startsWith("https://cdn.discordapp.com")
            ) {
                image_url = message.content;
                // this.log("found url in message, using that:");
            
            } else {
                
                image_url = message.attachments.first()?.attachment.toString();
                if(image_url?.startsWith("http"))
                    // this.log("found url in attachment, using that:");
                    1;
            }

            if(!image_url) {
                // this.log("no url found, skipping.");
                continue;
            }

            // this.log("validating whether url is image:", image_url);
            if(
                image_url?.endsWith("png") ||
                image_url?.endsWith("webp") ||
                image_url?.endsWith("jpg") ||
                image_url?.endsWith("jpeg")
            ) {
                // this.log("url is indeed image: ");
            } else {
                // this.log("url wasnt an image, skipping.");
                continue;
            }

          



            let collector = message.createReactionCollector({filter: (reaction) => {
                return ["💾"].includes(reaction.emoji.name!)
            }, time: 10000});

            

            collector.on('collect', (reaction, user) => {
                if(user.id == requestor_id && image_url)
                saved_images.push(image_url)
            });

            // give it a reaction, and registered callback to save image to album
            message.react("💾");


            collector.on('end', collected => {
                collected.forEach((reaction, key, map) => {
                    reaction.remove()
                });
                
            });

            latestCollector = collector;
            
        }

        latestCollector?.on('end', collected => {

            // this.log("reaction collection phase ended");
            for(let image of saved_images) {
                this.sbot.db.Albums.create({
                    user_id: requestor_id,
                    image_url: image,
                    album_name: album_name
                }).then(() => {
                    // this.log("Entry added:", requestor_id, image, album_name);
                });

            }
            let embed = new MessageEmbed();
            embed.setColor("#eca861");
            let plural = saved_images.length > 1 ? "s" : "";
            embed.addField(
                    `saved ${saved_images.length} image${plural} to album: ${album_name}.`,
                    `[View Album](https://nami.liya.insomnia247.nl/albums/${requestor_id}/${album_name})`);
            msg.channel.send({embeds: [embed]});
        });



    }
}