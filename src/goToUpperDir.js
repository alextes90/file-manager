import path from "path";

export const goToUpperDir = (currentDir) => {
  const pathToRoot = path.parse(currentDir).root;

  if (currentDir === pathToRoot) return currentDir;
  const parsedPath = path.parse(currentDir);
  const helperArr = parsedPath.dir.split(path.sep).slice(1);
  const pathToUpperDir = path.join(parsedPath.root, ...helperArr);
  return pathToUpperDir;
};
