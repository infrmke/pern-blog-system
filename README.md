# [PERN, Legacy] Blog REST API

> [!CAUTION]
> ESTA É UMA VERSÃO LEGADO (PERN STACK)

Uma API Restful para blog desenvolvida com a PERN Stack (PostgreSQL, Express, React, Node.js). O sucessor oficial deste sistema foi migrado para a stack Java 21+ Spring Boot e pode ser encontrado na branch [main](https://github.com/infrmke/spring-react-blog-system/tree/main).

## Síntese da Transição

Esta branch documenta a implementação original em Node. Se você deseja ver a evolução deste projeto para uma arquitetura mais tipada, confira as principais mudanças na branch principal:

- **Linguagem**: Transição de JavaScript (CommonJS/ESM) para Java 21;
- **Back-end**: Migração de Express 5+ para Spring Boot 4+.

## Visão Geral Técnica

O projeto consiste em uma API simples de uma plataforma de blog, focada em escalabilidade e segurança. O sistema gerencia o ciclo de vida de usuários, publicações e interações (comentários e curtidas), com um sistema de upload de mídia isolado para otimização de tráfego e armazenamento.

- **Back-end**: Node.js 20+ com Express 5+;
- **Database**: PostgreSQL com Migrations e restrições de unicidade composta.

## Arquitetura e Padrões de Design

O projeto é **híbrido**, tendo classes (Singleton) para camadas que mantêm responsabilidades fixas (Controllers/Services/Repositories) e funções modulares para lógica auxiliar.

- **Monólito Modular**: O sistema é organizado em módulos por domínio (User, Session, Post, Comment, PostLike), facilitando a manutenção;
- **Isolamento de Recursos (Mídia)**: Adoção de rotas dedicadas (PATCH) para atualização de arquivos binários, separando o fluxo de dados JSON do fluxo de arquivos multipart/form-data;
- **Associações Fortes**: Uso de integridade referencial no banco de dados, incluindo Composite Unique Constraints (para impedir que um usuário curta o mesmo post duas vezes);
- **Tratamento Global de Erros**: Centralização de exceções através de um utilitário especializado (throwHttpError) e um middleware de erro global.

## Tech Stack e Bibliotecas

### Back-end (Node.js 22.21 e Express 5.2)

- **Database**: `PostgreSQL`;
- **ORM**: `Sequelize` (com uso de Migrations e hooks beforeValidate);
- **Security**: `bcrypt` para hashing e validação de senhas, `jsonwebtoken` para autenticação Stateless, `express-rate-limit` para limitar tráfego e proteger a API contra ataques de brute force, e `express-validator` para a validação de inputs;
- **File Management**: `Multer` (configurado com memoryStorage() para processamento em buffer e com filtragem de Mimetype);

## Funcionalidades

- **Autenticação Stateless**: Sistema de login seguro com persistência via cookies httpOnly e secure;
- **RBAC (Role-Based Access Control)**: Diferenciação de permissões entre usuários comuns e administradores;
- **Paginação e Busca**: Implementação de limit e offset para listagens de recursos com suporte a busca geral e parcial de títulos com Op.iLike;
- **Gestão de Mídia**: Redimensionamento e conversão automática de imagens para WebP, com gestão automática de storage (remoção de arquivos órfãos);
- **Slugification**: Geração automática de URLs para posts e perfis.

## Como rodar o projeto

Os pré-requisitos são os seguintes:

- Node.js (18 ou superior);
- npm ou yarn;
- PostgreSQL disponível localmente.

1. Clone o repositório:

```shell
    git clone https://github.com/infrmke/spring-react-blog-system.git
    cd spring-react-blog-system

    # Para rodar esta versão específica (PERN), basta mudar para a branch legacy:
    git checkout -b legacy/node-pern
```

2. Instale as dependências:

```shell
    npm install
```

3. Configure o BD no seu PostgreSQL (via pgAdmin ou terminal), criando um banco de dados chamado "blog_db" (ou o nome de sua preferência).

4. Crie um arquivo ".env" na raiz da pasta `backend` seguindo o modelo na seção "Variáveis de Ambiente". Certifique-se de que as credenciais do banco e o nome do banco criado (DB_NAME) estejam corretos.

5. Com o banco criado e o .env configurado, execute as migrations para criar as tabelas automaticamente:

```shell
  # Executa o npx sequelize-cli db:migrate
  npm run sequelize:migrate
```

6. Execute a API em modo de desenvolvimento:

```shell
    npm run dev
```

## Documentação da API

<p align="center">
  <a href="<https://www.postman.com/infrkme/workspace/public/collection/37979308-8525d35f-be54-4feb-98f9-95042a1d32d0?action=share&creator=37979308>">
    <img src="https://run.pstmn.io/button.svg" alt="Run in Postman" height="35">
  </a>
</p>

Você pode testar todos os endpoints da API diretamente no Postman através da coleção acima. Faça questão de configurar uma Variable `base_url` que aponte para a sua instância local ou de produção antes de realizar requisições a API.

## Variáveis de Ambiente

Para rodar o projeto, será necessário adicionar as seguintes variáveis de ambiente ao diretório correspondente ao back-end:

- `NODE_ENV`
- `PORT`
- `DB_USER`
- `DB_PWD`
- `DB_NAME`
- `DB_HOST`
- `JWT_ACCESS_SECRET`
