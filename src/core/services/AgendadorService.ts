import { Compromissos } from "../entities/Compromissos";
import { CompromissosRepo } from "../repositories/CompromissosRepo";

export class AgendadorService {
  constructor(private repo: CompromissosRepo) {}

  async listarCompomissos() {
    return this.repo.listar();
  }

  async agendarCompromisso(
    inicioStr: string,
    fimStr: string,
    descricao: string
  ) {
    const inicio = new Date(inicioStr);
    const fim = new Date(fimStr);

    if (isNaN(inicio.getTime()) || isNaN(fim.getTime())) {
      throw new Error("Data inválida.");
    }

    if (inicio >= fim) {
      throw new Error("A data inicial deve ser anterior à final.");
    }

    const conflito = await this.repo.encontrarSobreposicao(inicio, fim);

    if (conflito) {
      throw new Error(
        "Conflito de horário! Já existe um compromisso nesse intervalo."
      );
    }

    const novoCompromissos: Compromissos = {
      inicio_data: inicio,
      fim_data: fim,
      descricao,
    };

    await this.repo.salvar(novoCompromissos);
    console.log("Agendado com sucesso!");
  }
}
