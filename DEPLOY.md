# 🚀 Guia de Publicação do Conecta Social na Vercel

Este guia detalha o passo a passo exato para colocar sua rede social no ar gratuitamente usando a **Vercel** (hospedagem) e o **Supabase** (banco PostgreSQL em nuvem).

---

## 📋 Pré-requisitos
1. Seu código já está no GitHub: `https://github.com/jpinhata15-netizen/REDESOCIAL`
2. Conta gratuita no [Supabase](https://supabase.com)
3. Conta gratuita na [Vercel](https://vercel.com)

---

## 1️⃣ Passo 1: Criar o Banco PostgreSQL no Supabase (3 minutos)

1. Acesse [supabase.com](https://supabase.com) e faça login (pode entrar com sua conta do GitHub).
2. Clique em **"New Project"**.
3. Escolha:
   - **Name**: `conecta-social`
   - **Database Password**: crie uma senha forte e **guarde-a**!
   - **Region**: `South America (São Paulo)` (para menor latência).
4. Clique em **"Create new project"** e aguarde ~2 minutos enquanto o banco inicializa.
5. Quando terminar, vá em **Project Settings** (ícone de engrenagem) > **Database** > procure por **Connection string** > selecione **URI**:
   - Copie a URL do **Transaction Pooler** (para `DATABASE_URL`).
   - Copie a URL do **Direct Connection** (para `DIRECT_URL`).
   *(Substitua `[YOUR-PASSWORD]` pela senha que você definiu ao criar o projeto).*

---

## 2️⃣ Passo 2: Criar as Tabelas no Banco (1 minuto)

No seu terminal local aqui na máquina, configure o `.env` com a URL do Supabase e rode:
```bash
npx prisma db push
node scripts/seed.mjs
```
*(Isso cria todas as tabelas de posts, usuários, depoimentos, comunidades e já insere dados de teste).*

---

## 3️⃣ Passo 3: Conectar e Publicar na Vercel (3 minutos)

1. Acesse [vercel.com](https://vercel.com) e faça login com o mesmo GitHub `jpinhata15-netizen`.
2. Clique em **"Add New..."** > **"Project"**.
3. Na lista de repositórios do GitHub, você verá **`REDESOCIAL`**. Clique em **"Import"**.
4. Em **Configure Project**:
   - **Framework Preset**: Next.js (já detecta automático)
   - **Root Directory**: `./` (padrão)
5. Abra a seção **Environment Variables** e adicione as seguintes variáveis:

| Nome da Variável | Onde pegar / Valor |
| :--- | :--- |
| `DATABASE_URL` | URL de conexão do Supabase (Pooler) |
| `DIRECT_URL` | URL de conexão direta do Supabase (Direct) |
| `JWT_SECRET` | Qualquer frase longa e segura (ex: `conecta_social_jwt_super_seguro_2026`) |
| `NEXT_PUBLIC_APP_URL` | `https://sua-url-na-vercel.vercel.app` (pode ajustar após o 1º deploy) |

6. Clique no botão azul **"Deploy"**! 🎉

A Vercel vai instalar os pacotes, gerar o client do Prisma e compilar o Next.js. Em cerca de 1 a 2 minutos seu site estará no ar com link público HTTPS!
