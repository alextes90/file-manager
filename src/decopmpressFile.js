import { pipeline } from "stream/promises";
import { createBrotliDecompress } from "zlib";
import { createReadStream, createWriteStream } from "fs";
import { stat, access } from "fs/promises";
import { pathToSource } from "./utils/index.js";
import path from "path";

export const decompressFile = async (
  pathToCurrentDir,
  pathToFile,
  pathToDestination
) => {
  try {
    const decompressStream = createBrotliDecompress();
    const pathToSrc = pathToSource(pathToCurrentDir, pathToFile);
    let pathToDest = pathToSource(pathToCurrentDir, pathToDestination);

    if ((await stat(pathToDest)).isDirectory()) {
      pathToDest = path.join(pathToDest, "decompressed.txt");
    }

    let isSrcCorrect = true;

    try {
      await access(pathToSrc);
    } catch {
      isSrcCorrect = false;
    }

    if (!isSrcCorrect || path.parse(pathToSrc).ext !== ".br") {
      throw new Error("");
    }

    const source = createReadStream(pathToSrc);
    const destination = createWriteStream(pathToDest);

    await pipeline(source, decompressStream, destination);
  } catch {
    console.error("FS operation failed");
  }
};
