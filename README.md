# Conecta ✦ — A Rede Social Brasileira

> A rede social inspirada nas melhores experiências sociais, com identidade própria, acolhimento brasileiro, estética premium e o diferencial inconfundível do sistema de depoimentos com consentimento.

![Conecta Social](https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=1200&auto=format&fit=crop&q=80)

---

## 🚀 Como Executar o Projeto Localmente

### 1. Pré-requisitos
- **Node.js** (v18 ou superior instalado)
- **npm** (incluso com o Node.js)

### 2. Instalação e Inicialização

No terminal do projeto, execute:

```bash
# 1. Instalar as dependências
npm install

# 2. Inicializar e sincronizar o banco de dados relacional local (SQLite)
npm run prisma:push

# 3. Povoar o banco com perfis e conteúdos de demonstração brasileiros
npm run prisma:seed

# 4. Iniciar o servidor de desenvolvimento
npm run dev
```

Abra seu navegador em: **`http://localhost:3000`**

---

## 🔑 Contas de Demonstração para Testes Imediatos

Todas as contas foram criadas com a senha padrão: **`Conecta@2026`**  
*(Dica: Na página `/login`, você também pode clicar diretamente nos botões de acesso rápido!)*

| Papel | Nome | Nome de Usuário (`@`) | E-mail | Destaque |
|---|---|---|---|---|
| **Admin** | Conecta Oficial | `conecta` | `contato@conecta.social` | Acesso ao Painel Admin (`/admin`), moderação e métricas |
| **Usuária** | Clarice Lisboa | `clarice` | `clarice@exemplo.com.br` | Cronista carioca, possui depoimentos para aprovar |
| **Dev** | Thiago Silva | `thiago_dev` | `thiago@exemplo.com.br` | Desenvolvedor, dono da comunidade Tech Brasil |
| **Fotógrafa** | Marina Santos | `marina_foto` | `marina@exemplo.com.br` | Fotógrafa de Salvador, dona da comunidade de fotografia |
| **Urbanista** | Lucas Mendes | `lucas_eco` | `lucas@exemplo.com.br` | Urbanista de Curitiba |

---

## 🌟 Funcionalidades e Destaques da Plataforma

1. **Identidade Visual Brasileira & Design System**:
   - Layout responsivo de 3 colunas no Desktop e barra inferior fluida no Mobile.
   - Paleta esmeralda, jade, ouro âmbar e ardósia noturna com efeito glassmorphism e sombras elegantes.
   - Ícones Lucide consistentes e tipografia legível.

2. **Sistema de Depoimentos (Recurso Estrela)**:
   - Envio de depoimentos com limite de até 1.000 caracteres.
   - **Aprovação Obrigatória do Destinatário**: Depoimentos ficam ocultos de terceiros até que o dono do perfil clique em "Aprovar" em `/depoimentos`.
   - Aba pública no perfil exibindo apenas depoimentos aceitos.

3. **Feed Interativo & Compositor de Mídia**:
   - Compositor com suporte a textos, anexos de múltiplas fotografias em galeria, links de vídeos e seletor de privacidade (Público, Seguidores, Privado).
   - Curtidas otimistas com coração pulsante, comentários com respostas aninhadas e salvamento nos favoritos.
   - Hashtags clicáveis integradas à busca global.

4. **Comunidades Públicas e Privadas**:
   - Exploração por categorias temáticas (*Tecnologia*, *Artes*, *Gastronomia*, *Literatura*, etc.).
   - Criação de novas comunidades com regras próprias.
   - Controle de privacidade em nível de dados: conteúdos de comunidades privadas são protegidos e exigem aprovação de solicitação de entrada.

5. **Mensagens Privadas (Direct Messages)**:
   - Chat direto em tempo real com indicador de mensagens não lidas e histórico completo.

6. **Painel Administrativo Restrito (`/admin`)**:
   - Métricas em tempo real de usuários, publicações e comunidades.
   - Fila de moderação de denúncias e registros de auditoria.

7. **Privacidade e Conformidade LGPD**:
   - Termos de Uso (`/termos`) e Política de Privacidade (`/privacidade`).
   - Exportação de dados do titular em JSON e fluxo de exclusão de conta em `/configuracoes`.

---

## ☁️ Deploy e Integração com Supabase Cloud

Para publicar a rede social com banco de dados distribuído PostgreSQL e Row Level Security (RLS) no Supabase, siga o guia detalhado em **[`SUPABASE_SETUP.md`](./SUPABASE_SETUP.md)**. O script SQL completo com todas as tabelas e políticas de segurança está pronto em `supabase/migrations/001_conecta_schema.sql`.

---

## 🛠️ Tecnologias Utilizadas

- **Frontend**: Next.js 16 (App Router com Turbopack), React 19, TypeScript, Tailwind CSS.
- **Ícones & Estilo**: Lucide Icons, Glassmorphism, CSS Custom Properties.
- **Backend & Dados**: Next.js Route Handlers, Prisma ORM, SQLite (local) e PostgreSQL / Supabase (nuvem com RLS).
- **Segurança**: Bcryptjs (hashing de senhas), JWT, Cookies de sessão HTTP-Only seguros, controle de acesso baseado em papéis (RBAC).
- **Formatadores**: Date-fns (pt-BR).

---

Conecta Social © 2026 — *Feito para aproximar e valorizar o Brasil.*
