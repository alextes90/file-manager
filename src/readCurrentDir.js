import fs from "fs/promises";
import path from "path";

export const readCurrentDir = async (pathToCurrentDir) => {
  try {
    const response = await fs.readdir(pathToCurrentDir, {
      withFileTypes: true,
    });
    const directoryArr = [];
    const fileArr = [];
    response.forEach((file) => {
      if (file.isDirectory()) {
        directoryArr.push({
          name: path.basename(path.join(pathToCurrentDir, file.name)),
          type: "directory",
        });
      } else {
        fileArr.push({
          name: path.basename(path.join(pathToCurrentDir, file.name)),
          type: "file",
        });
      }
    });
    const displayedData = [
      ...directoryArr.sort((a, b) => a.name - b.name),
      ...fileArr.sort((a, b) => a.name - b.name),
    ];
    console.table(displayedData);
  } catch {
    console.error("FS operation failed");
  }
};
