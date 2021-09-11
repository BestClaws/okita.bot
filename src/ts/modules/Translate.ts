import { CommandInteraction, Message, MessageEmbed, TextChannel, Webhook } from "discord.js";
import SBot from "../core/SBot";
import Module from "../core/Module";

import { v2 }  from "@google-cloud/translate";
const translate = new v2.Translate();

export default class Say extends Module {

    constructor(sbot: SBot) {
        super(sbot);
        this.commandName = "tr";

    }


    async processInteraction(interaction: CommandInteraction) {
        let message = interaction.options.getString('text') || "-";
        let target = interaction.options.getString('lang') || 'en';
        let result = await this.translateText(message, target as string);

        interaction.reply({
            "content": result,
            "ephemeral": true
        });
    }


    async processCommand(msg: Message, args: string[]) {

        let target = args.shift();

        if(!["vi", "en"].includes(target as string)) {
            msg.channel.send("that language is not enabled for now."); 
            return;
        }

        let message = args.join(" ");
        let result: string = await this.translateText(message, target as string);
       
        // i don't know why this space get's added.
        result = result.replace("<@! ", "<@!");
        
        this.log("tranlsated text:", result);



        msg.delete();

        // fetch this channel's webhook. if not present create it.
        let webhook = await this.fetchOrCreateWebhook(msg.channel as TextChannel);

        await webhook.edit({
            avatar: msg.author.avatarURL() as string,
        });

        
        webhook.sendSlackMessage({
            'username': (await msg.guild!.members.fetch(msg.author.id)).nickname ||  msg.author.username,
            'text': result
        }).catch(console.error);
        
      
    }





    async translateText(text: string, language: string) {

        let [translation]: any = await translate.translate(text, language);
        return translation
        
    }

    async createWebhook(channel: TextChannel): Promise<Webhook> {
        let webhook = await channel.createWebhook("Translate - " + channel.name, {
        })
        this.log(`Created webhook:  ${webhook.name} [${webhook.id}]`);
        return webhook;
    }

    async fetchOrCreateWebhook(channel: TextChannel): Promise<Webhook> {
        this.log("fetching webhooks for channel: ", channel.name);
        let webhooks = await channel.fetchWebhooks();

        let webhook: Webhook | null = null;

        webhooks.forEach(wh => {

            if(wh.name.startsWith("Translate")) {
                this.log("found a Translate webhook");
                webhook = wh;
                this.log(`fetched webhook: ${webhook.name} [${webhook.id}]`);
            }
        });


        
        if(webhook == null) {
            this.log("no Translate webhooks found");
            this.log("creating a Translate webhook");
            webhook = await this.createWebhook(channel);
        
        }
        
      
        return webhook;
    }
      






}
