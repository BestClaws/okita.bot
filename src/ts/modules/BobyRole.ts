import Discord from "discord.js";
import SBot from "../core/SBot";
import Module from "../core/Module";

export default class BobyRole extends Module {
    commandName = "role";
    enabled = true;

    constructor(sbot: SBot) {
        super(sbot);
    }


    async processCommand(msg: Discord.Message, args: string[]) {
        
        let boby_role: any;
        boby_role = msg.guild!.roles.cache.find((r) =>
            r.id == "772344547925688333"
        );

        let subcmd = args[0];
        let boby = await msg.guild!.members.fetch("657243574995517450");

        switch (subcmd) {
            case "equip":
                boby.roles.add(boby_role);
                this.log("equipped role for boby");

                return;
            case "dequip":
                boby.roles.remove(boby_role);
                this.log("dequipped role for boby");
                return;
        }

        if (subcmd.startsWith("#")) {
            const color = subcmd;
            boby_role.setColor(color);
            this.log("painted boby role with: ", color);

        } else {
            let name = "";
            for (let arg of args) name += arg + " ";

            this.log("changed boby role to name:", name);
            boby_role.setName(name.trim());
            return;
        }
    }
}
