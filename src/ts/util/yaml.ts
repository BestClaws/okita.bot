import yaml from 'yaml';
import fs from 'fs';


export  function load(path: string) {
    let configFile = fs.readFileSync(path, "utf-8");
    return yaml.parse(configFile);
};

export function save(path: string, data: any) {
    let dataString = yaml.stringify(data);
    fs.writeFileSync(path, dataString);
};
