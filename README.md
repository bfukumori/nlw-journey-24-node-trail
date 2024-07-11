# Planner App API

Backend do Planner, uma aplicação de gerenciamento de viagens.

## Ferramentas

- NodeJs
- Fastify
- Vitest
- Prisma
- Zod
- Typescript
- Dayjs
- Nodemailer
- Swagger

## Aprendizados importantes

- Criação de uma REST API utilizando Node e Fastify
- Criação de testes unitários utilizando Vitest
- Conexão com envio de emails utilizando Nodemailer
- Conexão com banco de dados utilizando Prisma
- Validações utilizando Zod
- Aplicações de princípios SOLID
- Criação de documentação com Swagger

## Como usar

### Pré-requisitos

- Node.js
- npm

### Instalação

1. Clone o repositório:

```bash
git clone https://github.com/bfukumori/nlw-journey-24-node-trail.git
cd nlw-journey-24-node-trail
```

2. Instale as dependências:
   
```bash
npm install
```

3. Inicie a aplicação:
   
```bash
npm run dev
```

A API estará disponível em http://localhost:3333.

#### Comandos

```bash
# Abre uma aba para manipular o banco de dados em http://localhost:5555
npx prisma studio
```

```bash
# Preenche o banco com dados fictícios
npx prisma db seed
```

```bash
# Apaga o banco atual e refaz o seed
npx prisma migrate reset
```

```bash
# Roda os testes unitários
npm run test
```

```bash
# Gera o coverage report dos testes
npm run coverage
```

#### REST API
O arquivo **client.http** possui as chamadas para os endpoint, caso você tenha a extensão do [REST Client instalada](https://marketplace.visualstudio.com/items?itemName=humao.rest-client).

## Documentação
A documentação foi gerada com o Swagger e se encontra em http://localhost:3333/docs.
