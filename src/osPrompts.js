import { EOL, homedir, cpus, userInfo, arch, availableParallelism } from "os";

export const osPrompts = async (prompt) => {
  switch (prompt) {
    case "EOL":
      console.log(`${JSON.stringify(EOL)}`);
      break;
    case "cpus":
      const dataOfCPUs = cpus().map((cpu) => {
        return { model: cpu.model, speed: cpu.speed / 1000 };
      });
      console.log(`There are: ${availableParallelism()}s cpus`);
      console.log(dataOfCPUs);
      break;
    case "homedir":
      const pathToUserHomeDir = homedir();
      console.log(pathToUserHomeDir);
      break;
    case "username":
      const { username } = userInfo();
      console.log(username);
      break;
    case "architecture":
      const architecture = arch();
      console.log(architecture);
      break;
    default:
      console.error("Invalid input");
  }
};
