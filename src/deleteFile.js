import fs from "fs/promises";
import { pathToSource } from "./utils/index.js";

export const deleteFile = async (pathToCurrentDir, pathToFileToDelete) => {
  try {
    const absolutePathToSource = pathToSource(
      pathToCurrentDir,
      pathToFileToDelete
    );

    const isDir = (await fs.stat(absolutePathToSource)).isDirectory();

    if (isDir) throw new Error();

    await fs.rm(absolutePathToSource);
  } catch {
    console.error("FS operation failed");
  }
};
