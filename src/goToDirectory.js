import path from "path";
import fs from "fs/promises";
import { pathToSource } from "./utils/index.js";

export const goToDirectory = async (pathToCurrentDir, pathToDir) => {
  if (!pathToDir) {
    console.error("Invalid input");
    return;
  }

  const pathToNewDirectory = pathToSource(pathToCurrentDir, pathToDir);

  try {
    await fs.access(pathToNewDirectory);
    return pathToNewDirectory;
  } catch {
    console.error("Operation failed");
  }
};
