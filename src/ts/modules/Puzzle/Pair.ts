export default class Pair {

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


