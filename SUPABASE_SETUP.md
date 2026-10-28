# Instruções de Integração e Deploy com o Supabase

A rede social **Conecta** foi concebida com arquitetura híbrida de alto nível:
1. **Ambiente Local**: Execução imediata com banco relacional SQLite via Prisma, sessão persistente por cookies HTTP-Only e hash criptográfico `bcryptjs`.
2. **Ambiente de Nuvem (Supabase)**: Banco de dados PostgreSQL distribuído, autenticação gerenciada, buckets de mídia (S3-compatible) e **Row Level Security (RLS)** ativo em todas as tabelas.

---

## 1. Passo a Passo para Configurar o Supabase Cloud

1. Acesse [supabase.com](https://supabase.com) e crie um novo projeto gratuito chamado `conecta-social`.
2. No painel do projeto, acesse **SQL Editor**.
3. Abra o arquivo `supabase/migrations/001_conecta_schema.sql` deste projeto, copie todo o conteúdo e execute-o no SQL Editor do Supabase.
   - Isso criará todas as tabelas relacionais com chaves estrangeiras, índices, gatilhos automáticos de perfil e políticas rigorosas de **Row Level Security (RLS)**.
4. No menu lateral do Supabase, vá em **Project Settings -> API**:
   - Copie a **Project URL** (`https://xyz.supabase.co`).
   - Copie a chave **anon / public**.
   - (Opcional para tarefas de admin) Copie a chave **service_role / secret**.
5. No arquivo `.env` do projeto local ou nas variáveis de ambiente da sua hospedagem (Vercel, Railway, etc.), preencha:
   ```env
   NEXT_PUBLIC_SUPABASE_URL="https://seu-projeto.supabase.co"
   NEXT_PUBLIC_SUPABASE_ANON_KEY="sua-chave-anon"
   SUPABASE_SERVICE_ROLE_KEY="sua-chave-service-role"
   ```

---

## 2. Configuração do Storage (Upload de Fotos e Vídeos)

No menu **Storage** do Supabase:
1. Crie um novo bucket público chamado `public-media` para fotos de perfil, capas e mídias de postagens.
2. Defina as seguintes regras de acesso (Policies):
   - **SELECT**: Qualquer pessoa pode visualizar (`true`).
   - **INSERT**: Apenas usuários autenticados (`auth.role() = 'authenticated'`).
   - **DELETE**: Apenas o proprietário do arquivo.

---

## 3. Políticas de Segurança e Depoimentos no RLS

A migração já contém a política de proteção absoluta para o diferencial de **Depoimentos**:
- Terceiros **não conseguem** consultar nenhum depoimento cujo `status` seja diferente de `ACCEPTED`.
- Somente o destinatário autenticado tem permissão para visualizar depoimentos pendentes para aprovação.
