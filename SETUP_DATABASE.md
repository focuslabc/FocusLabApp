# 🚀 Setup do Banco de Dados - Focus Lab

## Passo a Passo para Configurar o Supabase

### 1. Acesse o Supabase Dashboard
1. Vá para [https://app.supabase.com](https://app.supabase.com)
2. Entre no seu projeto
3. No menu lateral esquerdo, clique em **SQL Editor**

### 2. Execute o Schema
1. Clique em **"New Query"** (botão verde no canto superior direito)
2. Copie **TODO** o conteúdo do arquivo `/supabase-schema.sql`
3. Cole no editor SQL
4. Clique em **"Run"** (ou pressione Ctrl+Enter)

### 3. Verifique a Criação das Tabelas
1. No menu lateral, clique em **"Table Editor"**
2. Você deve ver todas estas tabelas criadas:
   - ✅ profiles
   - ✅ focus_objectives
   - ✅ red_tasks
   - ✅ tasks
   - ✅ projects
   - ✅ journal_entries
   - ✅ challenges
   - ✅ weekly_goals
   - ✅ library_commitments
   - ✅ journey_milestones

### 4. Teste a Aplicação
1. Volte para o Focus Lab
2. Faça logout (se estiver logado)
3. Faça login novamente
4. O sistema agora deve funcionar perfeitamente! 🎉

## O que foi criado?

### 📊 Tabelas Principais
- **profiles**: Perfil dos usuários (criado automaticamente no cadastro)
- **focus_objectives**: Objeto de Foco Trimestral
- **red_tasks**: Tarefas do Núcleo R.E.D.
- **tasks**: Tarefas gerais do Centro de Comando
- **projects**: Projetos do Laboratório
- **journal_entries**: Entradas do Diário de Reconfiguração
- **challenges**: Desafios do Modo Jornada
- **weekly_goals**: Metas Semanais
- **library_commitments**: Compromissos da Biblioteca Estratégica
- **journey_milestones**: Marcos da Jornada

### 🔒 Segurança (RLS)
- Row Level Security (RLS) ativado em todas as tabelas
- Cada usuário só vê e modifica seus próprios dados
- Email `cadecandidomartins@gmail.com` tem privilégios de owner

### ⚡ Performance
- Índices criados para queries rápidas
- Triggers para atualizar `updated_at` automaticamente
- Função automática para criar perfil no cadastro

## Problemas Comuns

### ❌ "relation already exists"
**Solução**: As tabelas já existem. Tudo OK! Você pode ignorar este erro.

### ❌ "permission denied"
**Solução**: Certifique-se de estar logado no projeto correto no Supabase.

### ❌ Ainda aparece erro PGRST205
**Solução**: 
1. Aguarde 10-30 segundos (cache do Supabase)
2. Faça refresh da página do Focus Lab
3. Se persistir, vá em Supabase > Settings > API e clique em "Restart API"

## 🎯 Próximos Passos

Após a configuração bem-sucedida:
1. Defina seu Objeto de Foco Trimestral
2. Configure suas tarefas R.E.D. (rotinas inegociáveis)
3. Explore o Centro de Comando
4. Comece sua jornada no Focus Lab! 🔥

---

💡 **Dica**: Mantenha este arquivo para referência futura ou caso precise recriar o banco em outro projeto Supabase.
