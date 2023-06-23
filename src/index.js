import { stdout, stdin } from "process";
import { exit } from "./utils/index.js";
import { goToUpperDir } from "./goToUpperDir.js";
import { readCurrentDir } from "./readCurrentDir.js";
import { EOL, homedir } from "os";
import { fileURLToPath } from "url";
import path from "path";
import { goToDirectory } from "./goToDirectory.js";
import { readFileByPath } from "./readFileByPath.js";
import { createNewFile } from "./createNewFile.js";
import { renameFile } from "./renameFile.js";
import { copyFileToNewDir } from "./copyFileInNewDir.js";

const DIR_PATH = path.dirname(fileURLToPath(import.meta.url));
const pathToUserHomeDir = homedir();

const USER_PREFIX = "username";

const parseEnv = () => {
  let userName = "Username";
  let pathToCurrentDir = pathToUserHomeDir;

  const [, inputVar] = process.argv
    ?.find((el) => el.startsWith(`--${USER_PREFIX}=`))
    ?.split(`--${USER_PREFIX}=`) || [, null];

  if (inputVar) {
    userName = inputVar;
  }

  stdout.write(`Welcome to the File Manager, ${userName}!${EOL}`);
  stdout.write(`You are currently in ${pathToCurrentDir}${EOL}`);

  stdin.on("data", async (data) => {
    const trimmedData = data.toString().trim();
    if (trimmedData === ".exit") {
      exit(userName);
    } else if (trimmedData === "up") {
      pathToCurrentDir = goToUpperDir(pathToCurrentDir);
    } else if (trimmedData.startsWith("cd ")) {
      const pathToDirectory = trimmedData.substring(3);
      pathToCurrentDir =
        (await goToDirectory(pathToCurrentDir, pathToDirectory)) ||
        pathToCurrentDir;
    } else if (trimmedData === "ls") {
      await readCurrentDir(pathToCurrentDir);
    } else if (trimmedData.startsWith("cat ")) {
      const pathToFile = trimmedData.substring(4);
      await readFileByPath(pathToCurrentDir, pathToFile);
    } else if (trimmedData.startsWith("add ")) {
      const newFileName = trimmedData.substring(4);
      await createNewFile(pathToCurrentDir, newFileName);
    } else if (trimmedData.startsWith("rn ")) {
      const [pathToFile, newFilename] = trimmedData.substring(3).split(" ") || [
        null,
        null,
      ];
      if (!pathToFile || !newFilename) {
        console.error(`Invalid input ${EOL}`);
      } else {
        await renameFile(pathToCurrentDir, pathToFile, newFilename);
      }
    } else if (trimmedData.startsWith("cp ")) {
      const [pathToFile, pathToNewDir] = trimmedData
        .substring(3)
        .split(" ") || [null, null];
      if (!pathToFile || !pathToNewDir) {
        console.error(`Invalid input ${EOL}`);
      } else {
        await copyFileToNewDir(pathToCurrentDir, pathToFile, pathToNewDir);
      }
    } else {
      stdout.write(`Invalid input ${EOL}`);
    }

    stdout.write(`You are currently in ${pathToCurrentDir}${EOL}`);
  });

  stdin.on("error", () => {
    console.log("FS operation failed");
  });

  process.on("SIGINT", () => {
    exit(userName);
  });
};

parseEnv();
