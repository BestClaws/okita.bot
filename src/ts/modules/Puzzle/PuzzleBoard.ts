import Pair from "./Pair";
import Tile from "./Tile";

export default class PuzzleBoard {

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