import readline from "readline";
import { AgendadorService } from "../../core/services/AgendadorService";

export class InteractiveCLI {
  private rl: readline.Interface;

  constructor(private service: AgendadorService) {
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
  }

  private ask(question: string): Promise<string> {
    return new Promise((resolve) => {
      this.rl.question(question, (answer) => {
        resolve(answer.trim());
      });
    });
  }

  private parseInputToDate(dateStr: string, timeStr: string): Date {
    const [day, month, year] = dateStr.split("/").map(Number);
    const [hours, minutes] = timeStr.split(":").map(Number);

    if (!day || !month || !year || isNaN(hours) || isNaN(minutes)) {
      throw new Error("Formato inválido. Use DD/MM/AAAA e HH:MM");
    }

    const date = new Date(year, month - 1, day, hours, minutes);
    return date;
  }

  public async start() {
    console.log("\n--- SISTEMA DE AGENDAMENTO (CLI) ---");

    let perguntar: boolean = true;

    while (perguntar) {
      console.log("\n1. Listar Compromissos");
      console.log("2. Adicionar Compromisso");
      console.log("3. Sair");

      const option = await this.ask("Escolha uma opção: ");

      switch (option) {
        case "1":
          await this.handleList();
          break;
        case "2":
          await this.handleAdd();
          break;
        case "3":
          console.log("Encerrando... Até mais!");
          perguntar = false;
          break;
        default:
          console.log("Opção inválida!");
          break;
      }
    }
  }

  private async handleList() {
    console.log("\n--- Lista de Compromissos ---");
    const list = await this.service.listarCompomissos();

    if (list.length === 0) {
      console.log("Nenhum compromisso agendado.");
      return;
    }

    console.table(
      list.map((appt) => ({
        ID: appt.id,
        Inicio: appt.inicio_data.toLocaleString("pt-BR"),
        Fim: appt.fim_data.toLocaleString("pt-BR"),
        Descricao: appt.descricao,
      }))
    );
  }

  private async handleAdd() {
    console.log("\n--- Novo Compromisso ---");

    try {
      const dateStr = await this.ask("Data (DD/MM/AAAA): ");
      const startStr = await this.ask("Hora Inicial (HH:MM): ");
      const endStr = await this.ask("Hora Final (HH:MM): ");
      const description = await this.ask("Descrição: ");
      const startDate = this.parseInputToDate(dateStr, startStr);
      const endDate = this.parseInputToDate(dateStr, endStr);
      await this.service.agendarCompromisso(
        startDate.toISOString(),
        endDate.toISOString(),
        description
      );
      console.log("Compromisso agendado com sucesso!");
    } catch (error: any) {
      console.error(`Erro ao agendar: ${error.message}`);
    }
  }
}
