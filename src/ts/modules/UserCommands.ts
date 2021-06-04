import Discord from "discord.js";
import HBot from "../core/HBot";
import Module from "../core/Module";


export default class UserCommands extends Module {

    commandName = "cmd";

    constructor(hbot: HBot) {
        super(hbot);
    }

    async processCommand(msg: Discord.Message, args: string[]) {

        let subcmd = args[0];

        switch(subcmd) {

            case "add":
                // check if command in the guild already exists.
                let exists = await this.hbot.db.UserCommands.findOne({
                    where: {
                        command_name: args[1],
                        command_guild: msg.guild!.id
                    }
                });



                // add command, if not exists.
                if(!exists)
                await this.hbot.db.UserCommands.create({
                    user_id: msg.author.id,
                    command_name: args[1],
                    command_value: args.slice(2).join(" "),
                    command_guild: msg.guild!.id,
                    command_author: msg.author.id
                });

                msg.channel.send("command added! (if dint exist before)");
                return;

       

            case "remove":
                // remove command from the guild.
                await this.hbot.db.UserCommands.destroy({
                    where: {
                        command_name: args[1],
                        command_guild: msg.guild!.id
                    }
                });

                msg.channel.send("command removed");
                return;


            case "list": // list commands.
             
                let records = await this.hbot.db.UserCommands.findAll({
                    where:  {"command_guild": msg.guild!.id},
                    attributes: [
                        "command_name",
                        "command_author",
                        "command_guild",
                        "command_value"
                    ]

                });
                const embed = new Discord.MessageEmbed();
                embed.setTitle("Available Commands");
          
                // group commands by users.
                // TODO: improve this messy block.
                let commands: any = {}      
                for(let record of records) {
                    if(commands[record.command_author] == undefined)
                        commands[record.command_author] = []
                    commands[record.command_author]
                        .push("`" + record.command_name + "`");
                }

                // update available commands description.
                for(let author in commands) {
                    // needs improvement! some users may be uncached.
                    // TODO: if uncached, cache manually
                    let author_name = await this.hbot.dClient.users.cache.get(author)!.username;
                    embed.addField(author_name, commands[author].join(" "));
                }

                embed.setColor("#eca861");
                msg.channel.send(embed);
                return;
              

            default:
                msg.channel.send("invalid subcomand!");
                return;

        }
    }

    async processMessage(msg: Discord.Message) {
        
        // check if the first word is a command request!
        let commandName = msg.content.split(" ")[0];
        if (commandName.endsWith("!")) {
            // remove trailig "!"
            commandName = commandName.substr(0, commandName.length - 1);
            
            let record = await this.hbot.db.UserCommands.findOne({
                where: {
                    command_name: commandName,
                    command_guild: msg.guild!.id
                }
            });

            if(record) {
                // see if command value is remote file, send it as attachment.
                // needs improvement.            
                if(
                    record.command_value.startsWith("http") &&
                    !record.command_value.startsWith("https://tenor.com") &&
                    !record.command_value.startsWith("https://imgur.com") &&
                    !record.command_value.startsWith("https://gyfcat.com")
                )
                    msg.channel.send({
                        files:[record.command_value]
                    });
                else
                    msg.channel.send(record.command_value);
                
            }                
            else
                return;

        }
    }

}