import Canvas from 'canvas';
import Discord from 'discord.js';
import HBot from '../core/HBot';
import Module from "../core/Module";
import Fuse from 'fuse.js';

import * as yaml from "../util/yaml";

export default class Puzzle extends Module {

    trials = 0;
    character = "nobody";
    ctx: any;
    background: any;
    board: any;
    canvas: any;
    listings: any;
    fuse: any;

    constructor(hbot: HBot) {
        super(hbot);
        this.commandName = "puzzle";
        
        this.listings  = yaml.load("./assets/puzzle/listings.yml");

    }

    
    async processCommand(msg: Discord.Message, args: string[]) {
    

        if(args[0] == "n"){
            this.newPuzzle(msg);
        
        } else if(args[0] == "r"){

            if(this.trials >= 5) {
                msg.channel.send("game over! you lose. '.puzzle n' for new puzzle");
        
            } else {
                this.trials++;

                this.ctx.drawImage(this.background, 0, 0, this.canvas.width, this.canvas.height); 
                this.board.removeRandom();
                this.board.draw();
        
                const attachment = new Discord.MessageAttachment(this.canvas.toBuffer(), 'welcome-image.png');
                await msg.channel.send(attachment);
                msg.channel.send(`${5 - this.trials} retries remain.`);
            }
            
        } else {
            let answer = msg.content.slice(8);
            if(this.fuse.search(answer).length > 0) {
                msg.channel.send('you win! type ".puzzle n" for new puzzle');
            } else {
                msg.channel.send(`wrong answer. ${5 - this.trials} retries remaining.\n try ".puzzle r" to reveal more`);
            }
        }


    }

    async newPuzzle(msg: Discord.Message) {

        let random = this.listings[Math.round(Math.random() * (this.listings.length - 1))]


        let fuse_options = {keys: ["name"]}
        let fuse_list = [{"name": random.name}]
        this.fuse = new Fuse(fuse_list, fuse_options);


        this.trials = 1;

        const canvas = Canvas.createCanvas(300, 375);
        const ctx = canvas.getContext('2d');

        this.ctx = ctx;
        this.canvas = canvas;


        const background = await Canvas.loadImage(`./assets/puzzle/${random.filename}`);
        this.background = background;

        let board = new PuzzleBoard(5, 4, 75, this.ctx);
        this.board = board;
        board.placeAll();
        this.board.removeRandom();

        this.ctx.drawImage(this.background, 0, 0, this.canvas.width, this.canvas.height); 
        this.board.draw();

        const attachment = new Discord.MessageAttachment(this.canvas.toBuffer(), 'welcome-image.png');
        await msg.channel.send(attachment);
        msg.channel.send(`${5 - this.trials} retries remain.`);

    }



}


class PuzzleBoard {

    ctx: any;
    rows: number;
    columns: number;
    tiles: any;
    tileSize: number;

    constructor(rows: number, columns: number, tileSize: number, ctx: any) {
        this.ctx = ctx;

        this.tileSize = tileSize;
        this.rows = rows;
        this.columns = columns;
        this.tiles = {};      
    }

    placeAll() {
        let maxIndex = this.rows * this.columns;
        for(let i = 1; i <= maxIndex; i++) {
            this.placeTile(i);
        }
    }

    removeAll() {
        let maxIndex = this.rows * this.columns;
        for(let i = 1; i <= maxIndex; i++) {
            this.removeTile(i);
        }    
    }



    removeRandom() {
        let random = Math.round(Object.keys(this.tiles).length * Math.random());
        console.log('random: ' + random);
        this.removeTile(random)
    }


    draw() {
          // draw tiles
        for(let tile in this.tiles) {
            this.tiles[tile].draw();
        }
    }

    placeTile(index: number) {
        let anchor = this._resolveAnchor(index);
        this.tiles[index] = new Tile(anchor, this.tileSize, this.ctx);
    }

    removeTile(index: number) {
        delete this.tiles[index];
        let x;
    }

 


    _indexToPair(index: number) {
        let m = Math.floor((index - 1) / this.columns) + 1;
        let n =  ((index - 1) % this.columns)+ 1 ;
        let pair = new Pair(m, n);

        return pair;
    }

    _pairToIndex(pair: Pair) {
        let index;
        index = (pair.m - 1) * this.columns + pair.n;
        return index; 
    }

    _resolveAnchor(index: number) {
        let pair = this._indexToPair(index);
        
        let tl = new Pair(
            (pair.m - 1) * this.tileSize,
            (pair.n - 1) * this.tileSize
        );

        return tl;

    }


}


class Tile {

    tileSize: number;
    anchor: Pair;
    ctx: any;

    constructor(anchor: Pair, tileSize: number, ctx: any) {
        this.tileSize = tileSize;
        this.anchor = anchor;
        this.ctx = ctx;

    }

    draw() {



        // basic tile
        this.ctx.fillStyle = "#cccccc"; 
        this.ctx.fillRect(
            this.anchor.n,
            this.anchor.m,
            this.tileSize,
            this.tileSize
        );
        


        //left shade
        this.ctx.fillStyle = "#00000033";
        this.ctx.lineWidth = 1;
        this.ctx.beginPath();
        this.ctx.moveTo(this.anchor.n, this.anchor.m);
        this.ctx.lineTo(
            this.anchor.n + this.tileSize / 10,
            this.anchor.m + this.tileSize / 10
        );
        this.ctx.lineTo(
            this.anchor.n + this.tileSize * 1 / 10,
            this.anchor.m + this.tileSize * 9 / 10
        );
        this.ctx.lineTo(
            this.anchor.n,
            this.anchor.m + this.tileSize
        );
        this.ctx.fill();
        this.ctx.closePath();

        //bottom shade
        this.ctx.fillStyle = "#00000033";
        this.ctx.lineWidth = 1;
        this.ctx.beginPath();
        this.ctx.moveTo(
            this.anchor.n,
            this.anchor.m + this.tileSize);
        this.ctx.lineTo(
            this.anchor.n + this.tileSize * 1 / 10,
            this.anchor.m + this.tileSize * 9 / 10
        );
        this.ctx.lineTo(
            this.anchor.n + this.tileSize * 9 / 10,
            this.anchor.m + this.tileSize * 9 / 10
        );
        this.ctx.lineTo(
            this.anchor.n + this.tileSize,
            this.anchor.m + this.tileSize
        );
        this.ctx.fill();
        this.ctx.closePath();



        // top shade
        this.ctx.fillStyle = "#ffffff55";
        this.ctx.lineWidth = 1;
        this.ctx.beginPath();
        this.ctx.moveTo(
            this.anchor.n,
            this.anchor.m
        );
        this.ctx.lineTo(
            this.anchor.n + this.tileSize / 10,
            this.anchor.m + this.tileSize / 10
        );
        this.ctx.lineTo(
            this.anchor.n + this.tileSize * 9 / 10,
            this.anchor.m + this.tileSize * 1 / 10
        );
        this.ctx.lineTo(
            this.anchor.n + this.tileSize,
            this.anchor.m
        );
        this.ctx.fill();
        this.ctx.closePath();

        // right shade
        this.ctx.fillStyle = "#ffffff55";
        this.ctx.lineWidth = 1;
        this.ctx.beginPath();

        this.ctx.moveTo(
            this.anchor.n + this.tileSize * 9 / 10,
            this.anchor.m + this.tileSize * 1 / 10
        );
        this.ctx.lineTo(
            this.anchor.n + this.tileSize,
            this.anchor.m
        );
        this.ctx.lineTo(
            this.anchor.n + this.tileSize,
            this.anchor.m + this.tileSize
        );
        this.ctx.lineTo(
            this.anchor.n + this.tileSize * 9 / 10,
            this.anchor.m + this.tileSize * 9 / 10
        );
        this.ctx.fill();
        this.ctx.closePath();

    }  





}


class Pair {

    m: number;
    n: number;
    
    constructor(m: number,n: number) {
        this.m = m;
        this.n = n;
    }

    print() {
        console.log(`(${this.m}, ${this.n})`)
    }
}

