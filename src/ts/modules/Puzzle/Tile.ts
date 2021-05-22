import Pair from "./Pair";


export default class Tile {

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