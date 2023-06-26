import { stdout, stdin } from "process";
import { argsSplit, exit } from "./utils/index.js";
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
import { deleteFile } from "./deleteFile.js";
import { osPrompts } from "./osPrompts.js";
import { generateHash } from "./generateHash.js";
import { compressFile } from "./compressFile.js";
import { decompressFile } from "./decopmpressFile.js";

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
      const [pathToFile, newFilename] = argsSplit(trimmedData.substring(3));
      if (!pathToFile || !newFilename) {
        console.error(`Invalid input ${EOL}`);
      } else {
        await renameFile(pathToCurrentDir, pathToFile, newFilename);
      }
    } else if (trimmedData.startsWith("cp ")) {
      const [pathToFile, pathToNewDir] = argsSplit(trimmedData.substring(3));
      if (!pathToFile || !pathToNewDir) {
        console.error(`Invalid input ${EOL}`);
      } else {
        await copyFileToNewDir(pathToCurrentDir, pathToFile, pathToNewDir);
      }
    } else if (trimmedData.startsWith("rm ")) {
      const fileToDelete = trimmedData.substring(3);
      await deleteFile(pathToCurrentDir, fileToDelete);
    } else if (trimmedData.startsWith("mv ")) {
      const [pathToFile, pathToNewDir] = argsSplit(trimmedData.substring(3));
      if (!pathToFile || !pathToNewDir) {
        console.error(`Invalid input ${EOL}`);
      } else {
        const thrownError = await copyFileToNewDir(
          pathToCurrentDir,
          pathToFile,
          pathToNewDir
        );
        if (thrownError !== "error") {
          await deleteFile(pathToCurrentDir, pathToFile);
        }
      }
    } else if (trimmedData.startsWith("os ")) {
      const [, command] = trimmedData.split("--") || [null, null];
      if (!command) {
        console.error(`Invalid input ${EOL}`);
      } else {
        osPrompts(command);
      }
    } else if (trimmedData.startsWith("hash ")) {
      const pathToFileToHash = trimmedData.substring(5);
      await generateHash(pathToCurrentDir, pathToFileToHash);
    } else if (trimmedData.startsWith("compress ")) {
      const [pathToFile, pathToDestination] = argsSplit(
        trimmedData.substring(9)
      );
      if (!pathToFile || !pathToDestination) {
        console.error(`Invalid input ${EOL}`);
      } else {
        await compressFile(pathToCurrentDir, pathToFile, pathToDestination);
      }
    } else if (trimmedData.startsWith("decompress ")) {
      const [pathToFile, pathToDestination] = argsSplit(
        trimmedData.substring(11)
      );
      if (!pathToFile || !pathToDestination) {
        console.error(`Invalid input ${EOL}`);
      } else {
        await decompressFile(pathToCurrentDir, pathToFile, pathToDestination);
      }
    } else {
      console.error(`Invalid input ${EOL}`);
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
