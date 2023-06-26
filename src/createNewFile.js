import fs from "fs/promises";
import { pathToSource } from "./utils/index.js";

export const createNewFile = async (pathToCurrentDir, fileName) => {
  try {
    const purePath = pathToSource(pathToCurrentDir, fileName);
    await fs.writeFile(purePath, " ", {
      flag: "wx",
    });
  } catch {
    console.error("FS operation failed");
  }
};
