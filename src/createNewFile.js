import fs from "fs/promises";
import path from "path";

export const createNewFile = async (pathToCurrentDir, fileName) => {
  try {
    await fs.writeFile(path.join(pathToCurrentDir, fileName), " ", {
      flag: "wx",
    });
  } catch {
    console.error("FS operation failed");
  }
};
