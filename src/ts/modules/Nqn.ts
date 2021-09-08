import { Channel, GuildEmoji, Message, TextChannel, Webhook } from "discord.js";
import SBot from "../core/SBot";
import Module from "../core/Module";

export default class Nqn extends Module {

    commandName = "nqn";

    // TODO: consider caching webhooks list.

    constructor(sbot: SBot) {
        super(sbot);


    }


    async processCommand(msg: Message, args: string[]) {

      


    }


    async processMessage(msg: Message) {



  
        // dont support larger messages
        if(msg.content.length > 100) return;


        // TODO: improve this 
        // unnecessary processing, if content doesnt have :emote:
        // possibly run a linear time check

        let response = msg.content.split(" ").map(token => {
            if(token.startsWith(":") && token.endsWith(":")) {
                let emote = this.findEmote(token.slice(1, token.length -1), msg.channel as TextChannel);
                
                if(emote)
                    return emote.animated ? 
                    `<a:${emote.name}:${emote?.id}>` : 
                    `<:${emote.name}:${emote?.id}>`
                else
                    return token;

            } else return token; // not an emote, return token

        }).join(" ");


        if(response == msg.content) return; // no changes.

        msg.delete();


        // fetch this channel's webhook. if not present create it.
        let webhook = await this.fetchOrCreateWebhook(msg.channel as TextChannel);

        await webhook.edit({
            avatar: msg.author.avatarURL() as string,
        });


        webhook.sendSlackMessage({
            'username': (await msg.guild!.members.fetch(msg.author.id)).nickname ||  msg.author.username,
            'text': response
        }).catch(console.error);



       
    }

    async createWebhook(channel: TextChannel): Promise<Webhook> {
        let webhook = await channel.createWebhook("NQN - " + channel.name, {
        })
        this.log(`Created webhook:  ${webhook.name} [${webhook.id}]`);
        return webhook;
    }

    async fetchOrCreateWebhook(channel: TextChannel): Promise<Webhook> {
        this.log("fetching webhooks for channel: ", channel.name);
        let webhooks = await channel.fetchWebhooks();

        let webhook: Webhook | null = null;

        webhooks.forEach(wh => {

            if(wh.name.startsWith("NQN")) {
                this.log("found a nqn webhook");
                webhook = wh;
                this.log(`fetched webhook: ${webhook.name} [${webhook.id}]`);
            }
        });


        
        if(webhook == null) {
            this.log("no nqn webhooks found");
            this.log("creating a nqn webhook");
            webhook = await this.createWebhook(channel);
        
        }
        
      
        return webhook;
    }


    findEmote(query: string, channel: TextChannel): GuildEmoji | undefined {
        // TODO: consider if discord.js cache is fast enough
        // (whether searching through a collection of GuildEmoji is as fast as searching
        // through a hashset of strings)
        
        // first search local server emotes.
        let results = channel.guild.emojis.cache.filter((emote) => 
            query == emote.name
        );

        if(results.size > 0)
            return results.first();
        
        // search globally.
        results = this.sbot.dClient.emojis.cache.filter((emote) => 
            query == emote.name
        );

        if(results.size > 0)
            return  results.first();

        else
            return undefined;
    }


}

