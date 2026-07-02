import { loadCSV } from "./services/csvLoader.js";

const data = await loadCSV();

console.log(data.slice(0, 5));
console.log("Rows:", data.length);