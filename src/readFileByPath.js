import fs from "fs";
import { pathToSource } from "./utils/index.js";

export const readFileByPath = async (pathToCurrentDir, pathToFile) => {
  return new Promise((resolve) => {
    const actualPath = pathToSource(pathToCurrentDir, pathToFile);
    const readableStream = fs.createReadStream(actualPath);

    readableStream
      .on("data", (data) => console.log(data.toString()))
      .on("error", () => console.log("Operation failed"))
      .on("close", resolve);
  });
};
