import { createReadStream } from "fs";
import { pathToSource } from "./utils/index.js";

const { createHash } = await import("crypto");

export const generateHash = async (pathToCurrentDir, pathToFile) => {
  return new Promise((resolve) => {
    const purePath = pathToSource(pathToCurrentDir, pathToFile);
    const readableStream = createReadStream(purePath);

    const helperArr = [];

    readableStream
      .on("data", (data) => {
        helperArr.push(data.toString());
      })
      .on("error", () => console.log("Operation failed"))
      .on("close", () => {
        if (helperArr.length !== 0) {
          const hash = createHash("sha256");
          console.log(hash.update(helperArr.join()).digest("hex"));
        }
        resolve();
      });
  });
};
