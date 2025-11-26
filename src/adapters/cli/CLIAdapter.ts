import { SchedulerService } from "../../services/SchedulerService";

export class CLIAdapter {
  constructor(private service: SchedulerService) {}

  public async execute(args: string[]) {
    const command = args[0];

    switch (command) {
      case "listar_compromissos":
        await this.listar();
        break;

      case "adicionar_compromisso":
        await this.adicionar(args);
        break;

      default:
        this.mostrarAjuda();
        break;
    }
  }

  private parseDate(dateStr: string, timeStr: string): Date {
    if (!dateStr || !timeStr) {
      throw new Error("Data e Hora são obrigatórias.");
    }

    const [day, month, year] = dateStr.split("/").map(Number);
    const [hours, minutes] = timeStr.split(":").map(Number);

    if (!day || !month || !year || isNaN(hours) || isNaN(minutes)) {
      throw new Error("Formato inválido. Use DD/MM/AAAA e HH:MM");
    }

    return new Date(year, month - 1, day, hours, minutes);
  }

  private async listar() {
    const list = await this.service.listarCompomissos();

    if (list.length === 0) {
      console.log("Nenhum compromisso encontrado.");
      return;
    }

    console.table(
      list.map((appt) => ({
        ID: appt.id,
        Data: appt.inicio_data.toLocaleDateString("pt-BR"),
        Inicio: appt.inicio_data.toLocaleTimeString("pt-BR", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        Fim: appt.fim_data.toLocaleTimeString("pt-BR", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        Descricao: appt.descricao,
      }))
    );
  }

  private async adicionar(args: string[]) {
    try {
      const [_, data, inicio, fim, desc] = args;

      if (!data || !inicio || !fim || !desc) {
        throw new Error("Faltam argumentos.");
      }

      const start = this.parseDate(data, inicio);
      const end = this.parseDate(data, fim);

      await this.service.agendarCompromisso(
        start.toISOString(),
        end.toISOString(),
        desc
      );

      console.log("Compromisso adicionado com sucesso!");
    } catch (error: any) {
      console.error(`Erro: ${error.message}`);
      this.mostrarAjuda();
    }
  }

  private mostrarAjuda() {
    console.log("\nComando incorreto.");
    console.log("Use:");
    console.log("npx ts-node src/index.ts listar_compromissos");
    console.log(
      'npx ts-node src/index.ts adicionar_compromisso "25/12/2024" "14:00" "15:00" "Natal"'
    );
  }
}
