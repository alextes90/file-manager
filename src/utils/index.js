import { stdout } from "process";
import { EOL } from "os";
import path from "path";

export const exit = (userName) => {
  stdout.write(`Thank you for using File Manager, ${userName}, goodbye!${EOL}`);
  process.exit();
};

export const pathToSource = (pathToCurrentDir, pathToSource) => {
  let pathToSourcePure = pathToSource;

  if (pathToSource.startsWith(`'`) || pathToSource.startsWith(`"`)) {
    pathToSourcePure = pathToSource.slice(1, -1);
  }

  if (path.isAbsolute(pathToSourcePure)) {
    return pathToSourcePure;
  } else {
    const absolutePathToSource = path.join(
      pathToCurrentDir,
      ...pathToSourcePure.split(path.sep)
    );
    return absolutePathToSource;
  }
};

export const argsSplit = (str) => {
  let pureString = str;
  let separator = " ";
  if (str.startsWith(`'`) && str.at(-1) === `'`) {
    pureString = str.slice(1, -1);
    separator = `' '`;
  }
  if (str.startsWith(`'`) && str.at(-1) !== `'`) {
    pureString = str.slice(1);
    separator = `' `;
  }
  if (!str.startsWith(`'`) && str.at(-1) === `'`) {
    pureString = str.slice(-1);
    separator = ` '`;
  }
  const [pathToSource, pathToDestination] = pureString.split(separator) || [
    null,
    null,
  ];
  return [pathToSource, pathToDestination];
};
