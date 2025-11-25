import express, { Request, Response, Express } from "express";
import { Server } from "http";
import { AgendadorService } from "../../core/services/AgendadorService";

export class ExpressServer {
  private app: Express;
  private server?: Server;

  constructor(private service: AgendadorService) {
    this.app = express();
    this.setupMiddlewares();
    this.setupRoutes();
  }

  private setupMiddlewares() {
    this.app.use(express.json());
  }

  private setupRoutes() {
    // ROTAListar
    this.app.get("/compromissos", async (req: Request, res: Response) => {
      try {
        const compromissos = await this.service.listarCompomissos();

        return res.status(200).json(compromissos);
      } catch (error: any) {
        console.error("Erro na API:", error);
        return res.status(500).json({ error: "Erro interno do servidor." });
      }
    });

    // ROTA Criar
    this.app.post("/compromissos", async (req: Request, res: Response) => {
      try {
        const { inicio_data, fim_data, descricao } = req.body;
        if (!inicio_data || !fim_data || !descricao) {
          return res.status(400).json({
            error:
              "Campos obrigatorios ausentes. Envie: inicio_data, fim_data, descricao.",
          });
        }

        await this.service.agendarCompromisso(inicio_data, fim_data, descricao);

        return res
          .status(201)
          .json({ message: "Compromisso agendado com sucesso!" });
      } catch (error: any) {
        return res.status(400).json({ error: error.message });
      }
    });
  }

  public start(port: number): void {
    this.server = this.app.listen(port, () => {
      console.log(`\n Servidor rodando: ${port}`);
      console.log(`GET: http://localhost:${port}/compromissos`);
      console.log(`POST: http://localhost:${port}/compromissos`);
    });
  }

  public stop(): void {
    this.server?.close();
  }
}
