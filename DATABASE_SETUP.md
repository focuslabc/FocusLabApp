# Focus Lab - Configuração do Banco de Dados

## ⚡ Setup Rápido

### 1. Acesse seu Projeto Supabase
- Vá para [https://supabase.com](https://supabase.com)
- Abra seu projeto Focus Lab

### 2. Execute o Schema SQL
1. No painel lateral, clique em **SQL Editor**
2. Clique em **New Query**
3. Copie TODO o conteúdo do arquivo `/supabase/schema.sql`
4. Cole no editor
5. Clique em **RUN** (Ctrl/Cmd + Enter)

### 3. Verificação
Após executar o SQL, você terá as seguintes tabelas criadas:

- ✅ `profiles` - Perfis de usuários
- ✅ `focus_objectives` - Objetivos de foco trimestrais
- ✅ `red_tasks` - Tarefas do núcleo R.E.D.
- ✅ `tasks` - Tarefas gerais
- ✅ `projects` - Projetos do Laboratório
- ✅ `journal_entries` - Entradas do diário
- ✅ `challenges` - Desafios comportamentais
- ✅ `challenge_progress` - Progresso dos desafios
- ✅ `weekly_goals` - Metas semanais
- ✅ `library_commitments` - Compromissos da biblioteca
- ✅ `journey_milestones` - Marcos do modo jornada
- ✅ `coworking_sessions` - Sessões de co-working

### 4. Políticas de Segurança (RLS)
Todas as tabelas já estão configuradas com Row Level Security (RLS) habilitado.
Cada usuário só pode ver e modificar seus próprios dados.

### 5. Usuário Especial (Dono)
O email `cadecandidomartins@gmail.com` é automaticamente marcado como `is_owner = true` no trigger de criação de perfil.

## 🔐 Autenticação

### Configuração do Email
No painel do Supabase:
1. Vá em **Authentication** > **Email Templates**
2. Customize os templates se desejar
3. Vá em **Authentication** > **URL Configuration**
4. Adicione a URL de produção do seu app

### Regras de Autenticação
O sistema suporta:
- ✅ Cadastro tradicional (email + senha)
- ✅ Login tradicional
- ✅ Confirmação de email
- ✅ Acesso privilegiado para o dono

## 📊 Estrutura de Dados

### Focus Objective (Objeto de Foco)
- Um por usuário (o mais recente é usado)
- Define meta trimestral
- Data alvo e horário de término

### RED Tasks (Rotina Essencial Diária)
- Categorias: Bio, Mind, Work, Outro
- Ordenáveis por position
- Completáveis com timestamp

### Projects (Laboratório)
- Status: active, paused, completed, archived
- Editor markdown/rich text no content

### Journal Entries (Diário)
- Um por dia por usuário
- Mood tracking
- Energy level (1-10)

### Challenges
- Duração configurável
- Status tracking
- Progress tracking separado

### Library Commitments
- Vinculados a vídeos
- Deadline opcional
- Completáveis

## 🚀 Próximos Passos

Após executar o schema:
1. A aplicação carregará dados reais do Supabase
2. Todos os dados serão persistidos automaticamente
3. Cada usuário terá seus próprios dados isolados
4. O sistema está pronto para produção

## 🔍 Debug

Para verificar se tudo funcionou:
1. Vá em **Table Editor** no Supabase
2. Você deve ver todas as tabelas listadas
3. Crie um usuário de teste no app
4. Verifique se o perfil foi criado automaticamente

## 📝 Migrations Futuras

Para adicionar novas funcionalidades:
1. Crie um novo arquivo SQL em `/supabase/migrations/`
2. Execute no SQL Editor
3. Atualize `/src/lib/api.ts` com as novas funções
