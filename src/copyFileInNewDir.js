import { createReadStream, createWriteStream } from "fs";
import fsPromise from "fs/promises";
import { pipeline } from "stream/promises";
import path from "path";
import { pathToSource } from "./utils/index.js";

export const copyFileToNewDir = async (
  pathToCurrentDir,
  pathToFile,
  newFileDir
) => {
  try {
    const pathToFileToCopy = pathToSource(pathToCurrentDir, pathToFile);
    const pathToNewDir = pathToSource(pathToCurrentDir, newFileDir);
    const fileName = path.basename(pathToFileToCopy);
    const pathToNewFile = path.join(pathToNewDir, fileName);

    const isOldPathDir = (await fsPromise.stat(pathToFileToCopy)).isDirectory();
    let isNewFileAlreadyExist = false;

    try {
      await fs.access(pathToNewFile);
      isNewFileAlreadyExist = true;
    } catch {}

    if (
      isOldPathDir ||
      isNewFileAlreadyExist ||
      pathToFileToCopy === pathToNewFile
    ) {
      throw new Error("");
    }

    const readStream = createReadStream(pathToFileToCopy);
    const writeStream = createWriteStream(pathToNewFile);

    await pipeline(readStream, writeStream);

    readStream.on("error", () => {
      throw new Error();
    });
  } catch {
    console.error("FS operation failed");
    return "error";
  }
};
