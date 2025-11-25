import { SQLiteCompromissoRepo } from "./infra/database/SQLiteCompromissoRepo";
import { AgendadorService } from "./core/services/AgendadorService";
import { ExpressServer } from "./adapters/api/ExpressServer";
import { InteractiveCLI } from "./adapters/cli/InteractiveCLI";

const start = async () => {
  const repo = new SQLiteCompromissoRepo();
  const service = new AgendadorService(repo);

  const args = process.argv.slice(2);

  // MODO API
  if (args.includes("--api")) {
    const server = new ExpressServer(service);
    server.start(3000);
    return;
  }

  //Modo Comando direto
  if (args[0] === "listar_compromissos") {
    const list = await service.listarCompomissos();
    console.table(list);
    return;
  }

  //Modo comando
  const cli = new InteractiveCLI(service);
  await cli.start();
};

start();
