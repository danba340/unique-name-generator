const fs = require("fs");
const https = require("https");
const URL = require("url");
const URL_BASE = "https://en.wikipedia.org/w/api.php";
const PARAMS = "?action=query&format=json&list=search&srsearch=";

function httpsRequest(method, url, params, body = null) {
  if (!["get", "post", "head"].includes(method)) {
    throw new Error(`Invalid method: ${method}`);
  }

  let urlObject;

  try {
    urlObject = new URL.parse(url);
  } catch (error) {
    throw new Error(`Invalid url ${url}`);
  }

  if (body && method !== "post") {
    throw new Error(
      `Invalid use of the body parameter while using the ${method.toUpperCase()} method.`
    );
  }

  let options = {
    method: method.toUpperCase(),
    hostname: urlObject.hostname,
    port: urlObject.port,
    path: urlObject.pathname + params,
  };

  if (body) {
    options.headers = { "Content-Length": Buffer.byteLength(body) };
  }

  return new Promise((resolve, reject) => {
    const clientRequest = https.request(options, (incomingMessage) => {
      // Response object.
      let response = {
        statusCode: incomingMessage.statusCode,
        headers: incomingMessage.headers,
        body: [],
      };

      // Collect response body data.
      incomingMessage.on("data", (chunk) => {
        response.body.push(chunk);
      });

      // Resolve on end.
      incomingMessage.on("end", () => {
        if (response.body.length) {
          response.body = response.body.join();

          try {
            response.body = JSON.parse(response.body);
          } catch (error) {
            // Silently fail if response is not JSON.
            console.log(error.message);
          }
        }

        resolve(response);
      });
    });

    // Reject on request error.
    clientRequest.on("error", (error) => {
      reject(error);
    });

    // Write request body if present.
    if (body) {
      clientRequest.write(body);
    }

    // Close HTTP connection.
    clientRequest.end();
  });
}

const allPossibleCombinations = (input, length, curstr) => {
  if (curstr.length == length) return [curstr];
  var ret = [];
  for (var i = 0; i < input.length; i++) {
    ret.push.apply(
      ret,
      allPossibleCombinations(input, length, curstr + input[i])
    );
  }
  return ret;
};

const namesToCsv = (names) => {
  return names
    .map((name) => {
      return `${name.name},${name.hits}`;
    })
    .join("\n");
};

const nameToCsvRow = (name, hits) => {
  return `${name},${hits}\n`;
};

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

function sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if (new Date().getTime() - start > milliseconds) {
      break;
    }
  }
}

const checkNames = async (checkedNames, allNames) => {
  for (let name of allNames) {
    // Name already checked
    if (checkedNames.some((checkedName) => checkedName.name === name)) {
      continue;
    }
    const res = await httpsRequest("get", URL_BASE, PARAMS + name);
    const hits = res.body.query.searchinfo.totalhits;
    fs.appendFileSync("results.csv", nameToCsvRow(name, hits));
    console.log("Saved", name, hits);
    sleep(100);
  }
};

const vowels = ["a", "e", "i", "o", "u", "y"];
const input = [
  "a",
  "b",
  "c",
  "d",
  "e",
  "f",
  "g",
  "h",
  "i",
  "j",
  "k",
  "l",
  "m",
  "n",
  "o",
  "p",
  "q",
  "r",
  "s",
  "t",
  "u",
  "v",
  "w",
  "x",
  "y",
  "z",
];
const combinations = allPossibleCombinations(input, 4, "");
const atLeastOneVowel = combinations.filter((combination) => {
  return (
    vowels.some((vowel) => {
      return combination.includes(vowel);
    }) && combination.includes("dor")
  );
});

const fileContent = fs.readFileSync("results.csv");
// Names already parsed
const namesInFile = csvToData(fileContent);

const tenNames = atLeastOneVowel.slice(0, 9);
checkNames(namesInFile, tenNames);
