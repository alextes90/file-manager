import { pipeline } from "stream/promises";
import { createBrotliCompress } from "zlib";
import { createReadStream, createWriteStream } from "fs";
import { stat, access } from "fs/promises";
import { pathToSource } from "./utils/index.js";
import path from "path";

export const compressFile = async (
  pathToCurrentDir,
  pathToFile,
  pathToDestination
) => {
  try {
    const compressStream = createBrotliCompress();
    const pathToSrc = pathToSource(pathToCurrentDir, pathToFile);
    let pathToDest = pathToSource(pathToCurrentDir, pathToDestination);

    if (!path.extname(pathToDest) === ".br") {
      if ((await stat(pathToDest)).isDirectory()) {
        pathToDest = path.join(pathToDest, "archive.br");
      }
    }

    let isSrcCorrect = true;

    try {
      await access(pathToSrc);
    } catch {
      isSrcCorrect = false;
    }

    if (!isSrcCorrect) {
      throw new Error();
    }

    const source = createReadStream(pathToSrc);
    const destination = createWriteStream(pathToDest);

    await pipeline(source, compressStream, destination);
  } catch {
    console.error("FS operation failed");
  }
};
