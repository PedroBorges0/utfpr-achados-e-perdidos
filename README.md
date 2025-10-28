# Achados e Perdidos Online

Este projeto tem como objetivo desenvolver uma aplicação web para gerenciamento de itens **perdidos e encontrados**, permitindo que usuários cadastrem objetos, realizem buscas e se conectem para recuperar seus pertences.  

O sistema é colaborativo, oferecendo uma interface intuitiva para cadastro, login e gerenciamento de itens, com foco em acessibilidade e praticidade.  

---

## Funcionalidades
- Cadastro e login de usuários  
- Cadastro de itens perdidos ou encontrados (com descrição, foto, data, local)  
- Busca e filtragem de itens cadastrados  
- Atualização de status do item (encontrado/devolvido)  
- Interface responsiva (desktop)  
- Sistema seguro de autenticação  

---

## Protótipo no Figma
As telas do projeto estão sendo desenhadas no Figma.  
Um futuro link será exibido aqui.  

---

## Stack Tecnológica
A stack foi definida considerando escalabilidade, suporte da comunidade e facilidade de manutenção:  

- **Frontend:** Next.js  
- **Backend:** Node.js (Express)
- **Banco de Dados:** PostgreSQL  
- **Design:** Figma  
- **Containerização:** Docker  

---

## Como Executar

### Pré-requisitos
- [Node.js](https://nodejs.org/) v18+  
- [PostgreSQL](https://www.postgresql.org/)
- [Git](https://git-scm.com/)  
- [Docker](https://www.docker.com/)  

### Passos para rodar localmente

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/seu-repositorio.git

# Entre no diretório do backend
cd backend

# Instale as dependências
npm install

# Configure as variáveis de ambiente no arquivo .env

# Rode o backend
npm run dev

# Abra outro terminal e vá para o frontend
cd frontend

# Instale as dependências
npm install

# Rode o frontend
npm run dev
