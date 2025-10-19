# Proposta de Stack Tecnológica - Site de Achados e Perdidos UTFPR

## Análise de Frontend

| Framework | Prós | Contras | Hospedagem típica |
|---|---|---|---|
| **React (Next.js)** | Grande comunidade, documentação completa; SSR/ISR prontos para SEO; integra frontend + backend via API Routes ou Server Actions; fácil integração com TypeScript. | Curva de aprendizado do App Router; mais decisões sobre estado, roteamento e estrutura. | Vercel, Docker, Netlify |
| **Angular** | Plataforma completa, CLI robusta, TypeScript nativo; ideal para times grandes. | Curva de aprendizado maior; verbosidade; mais pesado. | Vercel, Netlify, qualquer servidor web |
| **Vue (Nuxt)** | Curva de aprendizado suave; Single File Components (SFC); SSR via Nuxt; Vite rápido. | Ecossistema menos padronizado; decisões de arquitetura variam por projeto. | Vercel, Netlify, Docker |

---

## Análise de Backend

| Stack | Prós | Contras | Hospedagem típica |
|---|---|---|---|
| **Node.js (Express/NestJS)** | JavaScript/TypeScript no front e back; Express é minimalista; NestJS adiciona estrutura enterprise; ótima integração com ORM (Prisma). | Express exige montar várias partes (auth, validação); Nest adiciona curva inicial. | Docker, Render, Railway, AWS, Heroku |
| **Django (Python)** | "Baterias inclusas": admin, ORM, forms; produtividade alta; ótima documentação. | Se o front for React/Next.js, alterna linguagens; async/real-time exige cuidado. | Docker, AWS, Render, Heroku |
| **Spring Boot (Java)** | Robusto, escalável, padrão enterprise; ecossistema maduro. | Verbosidade; curva de aprendizado maior; setup inicial mais pesado. | Docker, AWS, Heroku |

---

## Banco de Dados

- **PostgreSQL**: relacional, maduro, ótimo para buscas complexas e integração com Docker; suporta PostGIS se precisar buscas por localização.
- Integra facilmente com **Prisma ORM**, oferecendo tipagem e migrações automáticas.

---

## Hospedagem / Deploy

- **Docker**: garante portabilidade, padrão de ambiente consistente, fácil escalabilidade em servidores ou nuvem.
- **Vercel**: excelente para frontend Next.js; Serverless Functions para backend leve.
- Combinação ideal: **frontend Next.js + backend Node.js em Docker + PostgreSQL em container** ou serviço gerenciado.

---

## Comparativo resumido

| Critério | Next.js + Node.js + PostgreSQL | Django | Spring Boot |
|---|---|---|---|
| Facilidade de aprendizado | Boa, tudo em JS/TS | Boa para Python, mas alterna linguagens | Mais difícil, curva alta |
| Comunidade & docs | Excelente | Excelente | Boa, corporativa |
| Desempenho & escalabilidade | SSR/ISR, Docker scaling horizontal | Bom, async exige configuração | Excelente, robusto |
| Integração banco de dados | Prisma + PostgreSQL | Django ORM | JPA/Hibernate |
| Hospedagem / deploy | Docker, Vercel, Render | Docker, Heroku | Docker, AWS/GCP |

---

## Stack Recomendada

- **Frontend:** Next.js (React) + TypeScript  
- **Backend:** Node.js (NestJS ou Express) + TypeScript  
- **Banco de Dados:** PostgreSQL  
- **Deploy / Infraestrutura:** Docker para backend e banco, Vercel para frontend (opcional)  

---

## Justificativa

- **Produtividade:** toda a stack em TypeScript, fácil para a equipe.  
- **SEO:** Next.js garante que itens do site sejam indexados.  
- **Escalabilidade:** Docker permite replicar backend e banco facilmente.  
- **Hospedagem flexível:** Vercel + Docker combina simplicidade e portabilidade.  
- **Manutenção:** Prisma + PostgreSQL facilita migrações, consultas e tipagem segura.
