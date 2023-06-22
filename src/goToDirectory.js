import path from "path";
import fs from "fs/promises";

export const goToDirectory = async (pathToCurrentDir, pathToDir) => {
  if (!pathToDir) {
    console.error("Invalid input");
    return;
  }

  let pathToNewDirectory;

  if (path.isAbsolute(pathToDir)) {
    pathToNewDirectory = pathToDir;
  } else {
    pathToNewDirectory = path.join(
      pathToCurrentDir,
      ...pathToDir.split(path.sep)
    );
  }

  try {
    await fs.access(pathToNewDirectory);
    return pathToNewDirectory;
  } catch {
    console.error("Operation failed");
  }
};
