import fs from "fs/promises";
import path from "path";
import { pathToSource } from "./utils/index.js";

export const renameFile = async (pathToCurrentDir, pathToFile, newFileName) => {
  try {
    const pathToFileToRename = pathToSource(pathToCurrentDir, pathToFile);
    let pathToNewFilename;
    if (path.isAbsolute(pathToFile)) {
      const helperArr = pathToFile.split(path.sep);
      helperArr.pop();
      pathToNewFilename = path.join(...helperArr, newFileName);
    } else {
      pathToNewFilename = path.join(pathToCurrentDir, newFileName);
    }

    const isOldPathDir = (await fs.stat(pathToFileToRename)).isDirectory();
    let isNewFileAlreadyExist = false;

    try {
      await fs.access(pathToNewFilename);
      isNewFileAlreadyExist = true;
    } catch {}

    if (isOldPathDir || isNewFileAlreadyExist) {
      throw new Error("");
    }

    await fs.rename(pathToFileToRename, pathToNewFilename);
  } catch {
    console.error("FS operation failed");
  }
};
