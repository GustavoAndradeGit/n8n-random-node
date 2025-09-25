# N8N Random Number Generator

Um conector personalizado para N8N que gera números verdadeiramente aleatórios usando a API do Random.org.

## 📋 Índice

- [Sobre](#sobre)
- [Funcionalidades](#funcionalidades)
- [Pré-requisitos](#pré-requisitos)
- [Instalação e Configuração](#instalação-e-configuração)
- [Configuração do Ambiente](#configuração-do-ambiente)
- [Como Usar](#como-usar)
- [Desenvolvimento](#desenvolvimento)
- [Executando Testes](#executando-testes)
- [Troubleshooting](#troubleshooting)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Licença](#licença)

## Sobre

Este projeto implementa um nó customizado para N8N que permite gerar números aleatórios usando o serviço Random.org, que utiliza ruído atmosférico para garantir aleatoriedade real ao invés de algoritmos pseudo-aleatórios.

## Funcionalidades

- Geração de números verdadeiramente aleatórios
- Interface configurável com valores mínimo e máximo
- Integração nativa com workflows N8N
- Testes automatizados em TypeScript

## Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- [**Node.js 22+** (LTS)](https://nodejs.org/)
- [**Docker Desktop**](https://www.docker.com/products/docker-desktop)
- [**Git**](https://git-scm.com/)

## Instalação e Configuração

### 1. Clone o repositório

```bash
git clone https://github.com/GustavoAndradeGit/n8n-random-node.git
cd n8n-random-node
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Compile o projeto

```bash
npm run build
```

### 4. Configure o ambiente

```bash
cp .env.example .env
```

Edite o arquivo .env se necessário. Para desenvolvimento local, as configurações padrão funcionam bem.

### 5. Inicie o Docker Desktop

- Abra o Docker Desktop
- Aguarde até aparecer o ícone na bandeja do sistema
- Verifique se está funcionando:

```bash
docker --version
```

### 6. Execute o projeto

```bash
npm start
```

Aguarde alguns minutos para o download das imagens e inicialização dos containers.

## Como usar

1. Acesse http://localhost:5678
2. Crie um usuário admin (primeira execução)
3. Crie um novo workflow
4. Adicione o nó "Random"
5. Configure os valores mínimo e máximo
6. Execute o workflow

### Exemplo de resultado

```json
{
  "randomNumber": 42,
  "min": 1,
  "max": 100,
  "source": "random.org",
  "timestamp": "2025-09-23T01:48:31.424Z"
}
```

## Desenvolvimento

### Scripts disponíveis

```bash
npm run build      # Compila o TypeScript
npm test          # Executa os testes
npm start         # Inicia o ambiente Docker
npm stop          # Para o ambiente Docker
npm run logs      # Ver logs do N8N
```

## Executar testes

### Todos os testes

```bash
npm test
```

### Testes com coverage

```bash
npm run test:coverage
```

## Modificar o código

1. Edite nodes/Random/Random.node.ts
2. Execute npm run build
3. Reinicie o N8N: docker-compose restart n8n
4. Refresh no navegador

## Troubleshooting

### Docker não inicia

- Verifique se o Docker Desktop está rodando
- Reinicie o Docker Desktop se necessário
- Execute: docker --version para testar

### Nó não aparece no N8N

```bash
npm run build
docker-compose restart n8n
```

### Reset completo

Se algo der errado e quiser recomeçar:

```bash
npm run clean
npm run build
npm start
```

Atenção: Isso apaga todos os workflows e dados do N8N.

## Tecnologias

- N8N - Plataforma de automação
- TypeScript - Linguagem principal
- Docker - Containerização
- PostgreSQL - Banco de dados
- Jest - Framework de testes
- Random.org API - Fonte de aleatoriedade

## Licença

MIT License - veja o arquivo LICENSE para detalhes.
