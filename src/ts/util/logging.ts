export function  log(...msg: any) {
    let [hour, minute, second] = new Date()
        .toLocaleTimeString("en-US")
        .split(/:| /);
    

    console.log(`[${hour}:${minute}:${second}]`, ...msg);
    
    

}
