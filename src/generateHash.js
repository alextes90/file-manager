import { createReadStream } from "fs";
import { pathToSource } from "./utils/index.js";

const { createHash } = await import("crypto");

const hash = createHash("sha256");

export const generateHash = async (pathToCurrentDir, pathToFile) => {
  return new Promise((resolve) => {
    const purePath = pathToSource(pathToCurrentDir, pathToFile);
    const readableStream = createReadStream(purePath);

    readableStream
      .on("error", () => console.log("Operation failed"))
      .on("close", resolve)
      .pipe(hash)
      .setEncoding("hex")
      .on("data", (data) => console.log(data.toString()));
  });
};
