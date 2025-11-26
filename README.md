# Sistema de Agendamento de Compromissos

Este é um sistema backend desenvolvido em TypeScript para gerenciar compromissos, implementando uma checagem de sobreposição.

## Arquitetura

1.  **Adapters**

    - `api/ExpressAdapter.ts`: Adaptador da api.
    - `cli/CLIAdapter.ts`: Adapter dos comandos.

2.  **entities**

    - `compromissos.ts`: Interface dos compromissos.

3.  **repositories**

    - `AppointmentRepo.ts`: comunicação com o Bando de dados.

4.  **service**

    - `SchedulerService.ts`: servico do agendador.

---

## Instalação e Configuração

1.  **Clone o repositório (ou descompacte o projeto):**

    ```bash
    git clone https://github.com/DEV-ALC/trabalho_implementacao_camadas.git
    cd trabalho_implementacao_camadas
    ```

2.  **Instale as dependências:**
    ```bash
    npm install
    ```

---

## Como Usar

Temos dois modos de operação.

### 1. Modo CLI

Roda direto apartir do comando

```bash
//criar
npx ts-node src/index.ts adicionar_compromisso "25/12/2024" "14:00" "15:00" "Natal"

//listar
npx ts-node src/index.ts listar_compromissos
```

### 2. Modo API REST

Levanta um servidor na porta 3000 para receber requisições HTTP.

```bash
npm run start:api
```

Rotas disponíveis:

```bash

GET /compromissos: Lista tudo.

POST /compromissos: Cria novo.
Payload: { "inicio_data": "ISO...", "fim_data": "ISO...", "descricao": "Texto" }
```
