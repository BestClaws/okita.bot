import { Message} from "discord.js";
import SBot from "../core/SBot";
import Module from "../core/Module";

import textToSpeech from '@google-cloud/text-to-speech';
import  { Readable } from 'stream';



const ttsClient = new textToSpeech.TextToSpeechClient();

export default class TTS extends Module {
    commandName = "tts";
    enabled = false;
    quota = 0;
    // enabled = false;

    constructor(sbot: SBot) {
        super(sbot);
    }

    async processCommand(msg: Message, args: String[]) {

        let text = msg.content.slice(5);
        this.log("got text", text);
        this.quota += text.length;
        this.speak(text, msg);
        this.log('quota used:', this.quota);
    }

    async processMessage(msg: Message) {
        let text = msg.content;
        this.log("got text:", text);
        this.quota += text.length;
        this.speak(text, msg);
        this.log('quota used:', this.quota);
    }

    async speak(text: String,msg: Message) {
        // Construct the request
        const request: any = {
            input: {ssml: text},
            // Select the language and SSML voice gender (optional)
            voice: {languageCode: 'ja-JP', name: 'en-US-Wavenet-F'},
            // select the type of audio encoding
            audioConfig: {audioEncoding: 'LINEAR16', pitch: 0},
        };
    
        // Performs the text-to-speech request
        const [response] = await ttsClient.synthesizeSpeech(request);

        let channelid = "804301515938463778"; // coop castle
        // let channelid = '744209394358812727'; // weebs
        // let channelid = "756419253858730005"; // nana
        
        let voiceChannel: any = msg.client.channels.cache.get(channelid);
        const connection = await voiceChannel!.join();
    
        var readStream =  new Readable({
            read() {
                this.push(response.audioContent)
                this.push(null);
            }
        });
    
    	connection.play(readStream);
    }

  

}
