# N8N Random Number Generator

Um conector personalizado para N8N que gera números verdadeiramente aleatórios usando a API do Random.org.

## **Índice**

- [Sobre](#sobre)
- [Funcionalidades](#funcionalidades)
- [Pré-requisitos](#pré-requisitos)
- [Instalação e Configuração](#instalação-e-configuração)
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

**⚠️ IMPORTANTE**: Edite o arquivo `.env` e configure as seguintes variáveis:

**Configurações do Banco de Dados:**

- `POSTGRES_USER`: Usuário do PostgreSQL (padrão: `n8n`)
- `POSTGRES_PASSWORD`: Senha do banco PostgreSQL (**substitua por uma senha segura**)
- `POSTGRES_DB`: Nome do banco de dados (padrão: `n8n`)
- `POSTGRES_PORT`: Porta do PostgreSQL (padrão: `5432`)

**Configurações de Autenticação:**

- `N8N_BASIC_AUTH_PASSWORD`: Senha do admin do N8N (**substitua por uma senha segura**)

**🔒 SEGURANÇA**: O arquivo `.env` contém informações sensíveis e está configurado no `.gitignore` para não ser commitado no repositório.

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
2. Crie um usuário (primeira execução)
   ![Criação de usuário](https://media.discordapp.net/attachments/749087664552017950/1420563327930859540/tela_de_registro.png?ex=68d5da32&is=68d488b2&hm=5dcaa336cef7ca7a2f93baf3a334183bc2a9f6ffa049be4f421d18bb24674b3f&=&format=webp&quality=lossless&width=884&height=544)
3. Crie um novo workflow
   ![Criação de workflow](https://media.discordapp.net/attachments/749087664552017950/1420563328362610759/tela_de_registro_2.png?ex=68d5da32&is=68d488b2&hm=fb24a348158fc80139760de3d349a3764feb0be31f464d51989a7a5e75e17018&=&format=webp&quality=lossless&width=1096&height=544)
4. Adicione o nó "Random"
   ![Adição de nó](https://media.discordapp.net/attachments/749087664552017950/1420563328719257721/tela_inicial.png?ex=68d5da32&is=68d488b2&hm=35499bf746800f8cb1ded1fb11935c2c74971e29b96782c9b201fef44cf178ae&=&format=webp&quality=lossless&width=1110&height=544)
5. Configure os valores mínimo e máximo
6. Execute o workflow
   ![Execução dos nó](https://media.discordapp.net/attachments/749087664552017950/1420563327465164900/executar.png?ex=68d5da32&is=68d488b2&hm=2c5dfa0eaf1b9717e47366110606d58d13d488992758ed2fb3b0cfc3baf4f611&=&format=webp&quality=lossless&width=1110&height=544)

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
