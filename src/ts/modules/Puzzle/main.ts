import Discord from 'discord.js';
import Canvas from 'canvas';
import Fuse from 'fuse.js';

import * as yaml from "../../util/yaml";

import HBot from '../../core/HBot';
import Module from "../../core/Module";
import PuzzleBoard from './PuzzleBoard';

import { Points } from "../../db/dbObjects";




export default class Puzzle extends Module {

    commandName = "puzzle";
    ctx: any;
    canvas: any;
    puzzleList: any;
    fuse: any;
    points: any;

    puzzles: any;

    
    constructor(hbot: HBot) {
        super(hbot);
        
        this.puzzleList  = yaml.load("./assets/puzzle/listings.yml");
        this.puzzles = [];
        this.points = [];

        this.canvas = Canvas.createCanvas(300, 375);
        this.ctx = this.canvas.getContext('2d');



    }

    
    async processCommand(msg: Discord.Message, args: string[]) {

        let subcmd = args[0].toLowerCase();
    
        // careful! possible undefined value is treated as null.
        let puzzleData = this.puzzles[msg.guild!.id];



        switch(subcmd) {

        case 'n':
            this.newPuzzle(msg);
            break;
        
        case "r":

            // confirm a puzzle is running first.
            if(puzzleData == null) {
                msg.channel.send("No puzzle started.\nType '.puzzle n' for a new puzzle.");
                return;
            }

            if(puzzleData.trials >= 5) {
                msg.channel.send(
                    `game over! you lose.\nThe answer was: ${puzzleData.character}`,
                    { files: [puzzleData.background.src] }
                );
                puzzleData = null;
        
            } else {
                puzzleData.trials++;

                this.ctx.drawImage(puzzleData.background, 0, 0, this.canvas.width, this.canvas.height); 
                puzzleData.board.removeRandom();
                puzzleData.board.draw();
        
                const attachment = new Discord.MessageAttachment(
                    this.canvas.toBuffer(),
                    "puzzle-image.png"
                );
                
                msg.channel.send(`${5 - puzzleData.trials} retries remain.`);
                msg.channel.send(attachment);
               
            }

            this.puzzles[msg.guild!.id] = puzzleData;
            
            break;

        default:
            // user(s) give answer.

            if(!this.points[msg.author.id]) { // cache user points record if not cached.
                let record = await Points.findOne({where: {user_id: msg.author.id}});
                if(record) { // user points record exists in db. cache it.
                    // cache record.
                    this.points[msg.author.id] = record.points;

                } else {  // no record exists in db create a new record and cache it.
                    await Points.create({user_id: msg.author.id, points: 0});
                    this.points[msg.author.id] = 0;
                }
            }

            // confirm a puzzle is running first.
            if(puzzleData == null) {
                msg.channel.send("no puzzle started. type 'puzzle n' for a new puzzle.");
                return;
            }

            let answer = msg.content.slice(8);
            if(puzzleData.fuse.search(answer).length > 0) {
                // right answer!

                let pointsWon = Math.pow((5 - puzzleData.trials), 2);
                let currentPoints = this.points[msg.author.id];
                let updatedPoints = currentPoints + pointsWon;
                this.points[msg.author.id] = updatedPoints;

                this.puzzles[msg.guild!.id] = null;
                
                msg.channel.send(
                    `you win!  +${pointsWon} points (total: ${this.points[msg.author.id]})\n` + 
                    `type ".puzzle n" for new puzzle`
                );

                // update db
                const affectedRows = await Points.update(
                    { points: updatedPoints },
                    { where: { user_id: msg.author.id } }
                );
                // if (affectedRows > 0) {
                // 	console.log("record updated");
                // }

                

            } else {
                msg.channel.send(`wrong answer. ${5 - puzzleData.trials} retries remaining.\n try ".puzzle r" to reveal more`);
            }
        }

       


    }

    async newPuzzle(msg: Discord.Message) {

        // get a random item from puzzle list

        // prolly make a function for it.
        let irandom = Math.round(Math.random() * (this.puzzleList.length - 1))
        let puzzleItem = this.puzzleList[irandom];


        let fuse_options = {keys: ["name"]}
        let fuse_list = [{"name": puzzleItem.name}]
        let fuse = new Fuse(fuse_list, fuse_options);


        const background = await Canvas.loadImage(`./assets/puzzle/${puzzleItem.filename}`);
        let board = new PuzzleBoard(5, 4, 75, this.ctx);
        

        let puzzleData = {
            trials: 1,
            character: puzzleItem.name,
            background: background,
            board: board,
            guild: msg.guild,
            fuse: fuse
        }

        this.puzzles[msg.guild!.id] = puzzleData;

        board.placeAll();
        board.removeRandom();

        this.ctx.drawImage(background, 0, 0, this.canvas.width, this.canvas.height); 
        board.draw();

        const attachment = new Discord.MessageAttachment(this.canvas.toBuffer(), 'puzzle-image.png');
        await msg.channel.send(attachment);
        msg.channel.send(`${5 - puzzleData.trials} retries remain.`);

    }



}
