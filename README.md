# WebAgendaFront

Aplica��o front-end em React + Vite para o sistema WebAgenda.

## Vis�o geral

Este projeto � a interface do usu�rio para agendamento de clientes. Ele consome o backend dispon�vel no reposit�rio `WebAgendaBack`, que fornece a API para listar, criar e excluir agendamentos.

> Importante: � necess�rio clonar e executar tamb�m o reposit�rio `WebAgendaBack` para que esta aplica��o funcione corretamente.

## Pr�-requisitos

- Node.js instalado (vers�o 18+ recomendada)
- npm
- Backend `WebAgendaBack` em execu��o

## Como usar

1. Clone este reposit�rio frontend:

2. Clone o backend (`WebAgendaBack`) em outra pasta:

3. Instale as depend�ncias do backend e execute-o conforme as instru��es do reposit�rio `WebAgendaBack`.

4. Volte para o frontend e instale as depend�ncias:

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

## Configura��o do backend

O front-end est� configurado para usar a API em `http://localhost:3030/`.

O arquivo de configura��o �:

- `src/services/api.ts`

Se o backend estiver em outra porta ou URL, atualize o valor de `baseURL` em `src/services/api.ts`.

## Funcionalidades

- Criar agendamentos
- Listar agendamentos ordenados por data
- Excluir agendamentos

## Scripts dispon�veis

- `npm run dev` - inicia o servidor de desenvolvimento
- `npm run build` - gera a vers�o de produ��o
- `npm run preview` - pr�-visualiza o build localmente

## Estrutura principal do projeto

- `src/App.tsx` - l�gica principal do front-end
- `src/services/api.ts` - cliente Axios para a API do backend
- `src/index.css` - estilos globais
- `tailwind.config.js` - configura��o do Tailwind CSS




