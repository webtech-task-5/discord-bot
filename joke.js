// import jokes from "./stupidstuff.json";
// console.log(jokes[10]);
import fs from "fs";

const data = fs.readFileSync("./stupidstuff.json", "utf8");

const jsonObject = JSON.parse(data);
// get a random joke from a function that returns a random joke
export function randomJoke() {
    return jsonObject[Math.floor(Math.random() * jsonObject.length)];
}

