import { stdout } from "process";
import { EOL } from "os";
import path from "path";

export const exit = (userName) => {
  stdout.write(`Thank you for using File Manager, ${userName}, goodbye!${EOL}`);
  process.exit();
};

export const pathToSource = (pathToCurrentDir, pathToSource) => {
  if (path.isAbsolute(pathToSource)) {
    return pathToSource;
  } else {
    const absolutePathToSource = path.join(
      pathToCurrentDir,
      ...pathToSource.split(path.sep)
    );
    return absolutePathToSource;
  }
};
