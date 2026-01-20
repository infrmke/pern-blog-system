# Full-Stack Blog System

Uma aplicação de plataforma para blog desenvolvida com a **PERN** Stack.

## Visão Geral Técnica (até agora...)

O projeto consiste em uma API simples de uma plataforma de blog, focada em escalabilidade e segurança.

Atualmente, o sistema gerencia o ciclo de vida de usuários, publicações e interações (comentários e curtidas), com um sistema de upload de mídia isolado para otimização de tráfego e armazenamento.

## Arquitetura e Padrões de Design (até agora...)

- **Monólito Modular**: O sistema é organizado em módulos por domínio (User, Post, Comment), facilitando a manutenção;
- **Controller-Model-Router**: Separação clara de responsabilidades, onde cada domínio possui sua própria classe controladora e lógica de roteamento;
- **Isolamento de Recursos (Mídia)**: Adoção de rotas dedicadas (PATCH) para atualização de arquivos binários, separando o fluxo de dados JSON do fluxo de arquivos `multipart/form-data`;
- **Associações Fortes**: Uso de integridade referencial no banco de dados, incluindo `Composite Unique Constraints` (ex: impedir que um usuário curta o mesmo post duas vezes).

## Tech Stack e Bibliotecas (até agora...)

- **Runtime**: Node.js;
- **Framework Web**: Express.js;
- **Database**: PostgreSQL;
- **ORM**: Sequelize (com uso de **Migrations** e hooks `beforeValidate`);
- **Security**:
  - _bcrypt_: Hashing e validação de senhas;
  - _jsonwebtoken_: Autenticação Stateless;
  - _express-rate-limit_: Estratégias diferentes para navegação normal, proteção contra ataques brute force e spam;
  - _express-validator_: Validação de inputs.
- **File Management**: Multer (com filtragem de `Mimetype` e armazenamento dinâmico);

## Funcionalidades (até agora...)

- **Autenticação JWT**: Sistema de login seguro com persistência via cookies `httpOnly` e `secure`;
- **RBAC (Role-Based Access Control)**: Diferenciação de permissões entre usuários comuns e administradores;
- **CRUDs RESTful**: Endpoints padronizados para todas as entidades;
- **Paginação**: Implementação de limit e offset para listagens de recursos;
- **Gestão de Mídia**: Sistema de upload que remove automaticamente arquivos antigos do disco ao atualizar avatares ou banners, evitando o acúmulo desnecessário;
- **Slugification**: Geração automática de URLs para posts e perfis.

## Planos Futuros

- **Camadas de Abstração**: Implementar Services (lógica de negócio) e Repositories (acesso a dados) para desacoplar o Sequelize dos Controllers (✔️);
- **Processamento de Imagem**: Integrar o `Sharp` para compressão automática e conversão para formato `.webp` (✔️);
- **Design Patterns**: Refatorar o back-end para seguir o padrão Singleton;
- **Construção da Fachada**: Implementar o front-end em React; e
- **Padronização de Erros**: Centralizar o tratamento de exceções com o utilitário throwHttpError() (✔️).
