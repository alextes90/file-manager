import { stdout } from "process";
import { EOL } from "os";

export const exit = (userName) => {
  stdout.write(`Thank you for using File Manager, ${userName}, goodbye!${EOL}`);
  process.exit();
};
