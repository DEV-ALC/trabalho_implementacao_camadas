import { AppointmentRepo } from "./repositories/AppointmentRepo";
import { SchedulerService } from "./services/SchedulerService";
import { ExpressAdapter } from "./adapters/api/ExpressAdapter";
import { CLIAdapter } from "./adapters/cli/CLIAdapter";

const start = async () => {
  const repo = new AppointmentRepo();
  const service = new SchedulerService(repo);

  const args = process.argv.slice(2);

  if (args.includes("--api")) {
    const server = new ExpressAdapter(service);
    server.start(3000);
  } else {
    const cli = new CLIAdapter(service);
    await cli.execute(args);
  }
};

start();
