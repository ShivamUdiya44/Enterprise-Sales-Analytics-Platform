import fs from "fs";
import path from "path";
import csv from "csv-parser";

const csvPath = path.join(process.cwd(), "data", "sales.csv");

export function loadCSV() {
    return new Promise((resolve, reject) => {
        const results = [];

        fs.createReadStream(csvPath)
            .pipe(csv())
            .on("data", (row) => {
                results.push(row);
            })
            .on("end", () => {
                resolve(results);
            })
            .on("error", (err) => {
                reject(err);
            });
    });
}