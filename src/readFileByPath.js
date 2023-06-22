import fs from "fs";
import path from "path";
import { pipeline, finished } from "stream/promises";

export const readFileByPath = async (pathToCurrentDir, pathToFile) => {
  return new Promise((resolve) => {
    let readableStream;
    let actualPath;

    if (path.isAbsolute(pathToFile)) {
      actualPath = pathToFile;
    } else {
      actualPath = path.join(pathToCurrentDir, pathToFile);
    }
    readableStream = fs.createReadStream(actualPath);

    readableStream
      .on("data", (data) => console.log(data.toString()))
      .on("error", () => console.log("Operation failed"))
      .on("close", resolve);
  });
};
