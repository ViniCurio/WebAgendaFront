# WebAgendaFront

Aplicação front-end em React + Vite para o sistema WebAgenda.

## Visão geral

Este projeto é a interface do usuário para agendamento de clientes. Ele consome o backend disponível no repositório `WebAgendaBack`, que fornece a API para listar, criar e excluir agendamentos.

> Importante: é necessário clonar e executar também o repositório `WebAgendaBack` para que esta aplicação funcione corretamente.

## Pré-requisitos

- Node.js instalado (versão 18+ recomendada)
- npm
- Backend `WebAgendaBack` em execução

## Como usar

1. Clone este repositório frontend:

```bash
git clone <url-do-repositorio-frontend>
cd WebAgendaFront
```

2. Clone o backend (`WebAgendaBack`) em outra pasta:

```bash
git clone <url-do-repositorio-backend>
cd WebAgendaBack
```

3. Instale as dependências do backend e execute-o conforme as instruções do repositório `WebAgendaBack`.

4. Volte para o frontend e instale as dependências:

```bash
cd ../WebAgendaFront
npm install
```

5. Inicie o frontend:

```bash
npm run dev
```

6. Abra o navegador em:

```bash
http://localhost:5173
```

## Configuração do backend

O front-end está configurado para usar a API em `http://localhost:3030/`.

O arquivo de configuração é:

- `src/services/api.ts`

Se o backend estiver em outra porta ou URL, atualize o valor de `baseURL` em `src/services/api.ts`.

## Funcionalidades

- Criar agendamentos
- Listar agendamentos ordenados por data
- Excluir agendamentos

## Scripts disponíveis

- `npm run dev` — inicia o servidor de desenvolvimento
- `npm run build` — gera a versão de produção
- `npm run preview` — pré-visualiza o build localmente

## Estrutura principal do projeto

- `src/App.tsx` — lógica principal do front-end
- `src/services/api.ts` — cliente Axios para a API do backend
- `src/index.css` — estilos globais
- `tailwind.config.js` — configuração do Tailwind CSS

## Observações

- Sem o backend `WebAgendaBack`, a aplicação não conseguirá buscar, criar ou excluir agendamentos.
- O backend deve expor os seguintes endpoints usados pelo front-end:
  - `GET /agenda`
  - `POST /agendamento`
  - `DELETE /agenda`

## Dica

Se o backend estiver rodando em outra máquina ou porta, atualize o `baseURL` em `src/services/api.ts` antes de iniciar o front-end.
