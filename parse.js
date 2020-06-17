const fs = require("fs");
const csvToData = (csv) => {
  return csv
    .toString()
    .split("\n")
    .map((line) => {
      const name = line.split(",")[0];
      const hits = line.split(",")[1];
      return { name, hits };
    })
    .filter(({ name }) => name.length);
};

const fileContent = fs.readFileSync("results.csv");
const namesInFile = csvToData(fileContent);
const sortedNames = namesInFile.sort((a, b) => {
  return a.hits - b.hits;
});
sortedNames.slice(0, 9).forEach((name) => {
  console.log(`${name.name}: ${name.hits}`);
});
