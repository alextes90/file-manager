import { stdout, stdin } from "process";
import { exit } from "./utils/index.js";
import { goToUpperDir } from "./goToUpperDir.js";
import { readCurrentDir } from "./readCurrentDir.js";
import { EOL, homedir } from "os";
import { fileURLToPath } from "url";
import path from "path";
import { goToDirectory } from "./goToDirectory.js";
import { readFileByPath } from "./readFileByPath.js";

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
