import { Compromissos } from "../entities/Compromissos";

export interface CompromissosRepo {
  salvar(appointment: Compromissos): Promise<void>;
  listar(): Promise<Compromissos[]>;
  encontrarSobreposicao(start: Date, end: Date): Promise<Compromissos | null>;
}
