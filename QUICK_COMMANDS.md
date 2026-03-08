# Focus Lab - Comandos Úteis

## 🔧 SQL úteis para o Supabase

### Ver dados de um usuário específico

```sql
-- Substituir 'user-id-aqui' pelo ID real do usuário
-- Você encontra o ID em: Authentication > Users

-- Ver todas as tarefas RED
SELECT * FROM red_tasks 
WHERE user_id = 'user-id-aqui'
ORDER BY position;

-- Ver objetivo de foco atual
SELECT * FROM focus_objectives 
WHERE user_id = 'user-id-aqui'
ORDER BY created_at DESC
LIMIT 1;

-- Ver todos os projetos
SELECT id, title, status, updated_at 
FROM projects 
WHERE user_id = 'user-id-aqui'
ORDER BY updated_at DESC;

-- Ver entradas do diário (últimos 7 dias)
SELECT date, mood, energy_level 
FROM journal_entries 
WHERE user_id = 'user-id-aqui'
AND date >= CURRENT_DATE - INTERVAL '7 days'
ORDER BY date DESC;

-- Ver desafios ativos
SELECT title, status, started_at, duration_days
FROM challenges
WHERE user_id = 'user-id-aqui'
AND status = 'active';
```

### Estatísticas e Analytics

```sql
-- Taxa de conclusão das tarefas RED
SELECT 
  COUNT(*) FILTER (WHERE completed = true) * 100.0 / NULLIF(COUNT(*), 0) as completion_rate
FROM red_tasks
WHERE user_id = 'user-id-aqui';

-- Streak de dias com entrada no diário
SELECT 
  COUNT(DISTINCT date) as days_with_entry,
  MAX(date) as last_entry
FROM journal_entries
WHERE user_id = 'user-id-aqui';

-- Projetos por status
SELECT status, COUNT(*) as count
FROM projects
WHERE user_id = 'user-id-aqui'
GROUP BY status;

-- Metas semanais - progresso médio
SELECT AVG(progress) as avg_progress
FROM weekly_goals
WHERE user_id = 'user-id-aqui';

-- Compromissos da biblioteca - taxa de conclusão
SELECT 
  COUNT(*) FILTER (WHERE completed = true) * 100.0 / NULLIF(COUNT(*), 0) as completion_rate
FROM library_commitments
WHERE user_id = 'user-id-aqui';
```

### Limpeza e Manutenção

```sql
-- CUIDADO: Estes comandos deletam dados permanentemente!

-- Deletar todas as tarefas completadas
DELETE FROM red_tasks 
WHERE user_id = 'user-id-aqui' 
AND completed = true;

-- Arquivar projetos inativos há mais de 30 dias
UPDATE projects 
SET status = 'archived'
WHERE user_id = 'user-id-aqui'
AND status = 'active'
AND updated_at < NOW() - INTERVAL '30 days';

-- Deletar metas semanais antigas (mais de 3 meses)
DELETE FROM weekly_goals
WHERE user_id = 'user-id-aqui'
AND week_start < CURRENT_DATE - INTERVAL '90 days';
```

### Backup de Dados

```sql
-- Exportar dados de um usuário (copiar resultado)
-- Execute cada query e exporte como CSV

-- Backup RED tasks
SELECT * FROM red_tasks WHERE user_id = 'user-id-aqui';

-- Backup Projects
SELECT * FROM projects WHERE user_id = 'user-id-aqui';

-- Backup Journal
SELECT * FROM journal_entries WHERE user_id = 'user-id-aqui';

-- Backup Challenges
SELECT * FROM challenges WHERE user_id = 'user-id-aqui';
```

### Resetar dados de teste

```sql
-- ATENÇÃO: Isto remove TODOS os dados do usuário!
-- Use apenas em ambiente de desenvolvimento

DO $$
DECLARE
  test_user_id UUID := 'user-id-aqui'::UUID;
BEGIN
  DELETE FROM journey_milestones WHERE user_id = test_user_id;
  DELETE FROM library_commitments WHERE user_id = test_user_id;
  DELETE FROM weekly_goals WHERE user_id = test_user_id;
  DELETE FROM challenge_progress WHERE user_id = test_user_id;
  DELETE FROM challenges WHERE user_id = test_user_id;
  DELETE FROM journal_entries WHERE user_id = test_user_id;
  DELETE FROM projects WHERE user_id = test_user_id;
  DELETE FROM tasks WHERE user_id = test_user_id;
  DELETE FROM red_tasks WHERE user_id = test_user_id;
  DELETE FROM focus_objectives WHERE user_id = test_user_id;
  DELETE FROM coworking_sessions WHERE user_id = test_user_id;
END $$;
```

## 🚀 Supabase Dashboard - Atalhos

### Authentication

```
Dashboard > Authentication > Users
```
- Ver todos os usuários cadastrados
- Verificar emails confirmados
- Deletar usuários de teste
- Resetar senhas

### Database

```
Dashboard > Table Editor
```
- Ver dados em formato tabular
- Editar registros manualmente
- Adicionar dados de teste
- Verificar relações

```
Dashboard > SQL Editor
```
- Executar queries personalizadas
- Criar functions e triggers
- Ver query history
- Salvar queries favoritas

### API

```
Dashboard > API Docs
```
- Ver endpoints auto-gerados
- Exemplos de código
- Schema definitions
- Authentication headers

## 📊 Queries de Monitoramento

### Dashboard de Admin

```sql
-- Estatísticas gerais do sistema
SELECT 
  (SELECT COUNT(*) FROM profiles) as total_users,
  (SELECT COUNT(*) FROM red_tasks) as total_red_tasks,
  (SELECT COUNT(*) FROM projects) as total_projects,
  (SELECT COUNT(*) FROM journal_entries) as total_journal_entries;

-- Usuários mais ativos (por tarefas RED)
SELECT 
  p.email,
  COUNT(rt.id) as red_tasks_count
FROM profiles p
LEFT JOIN red_tasks rt ON p.id = rt.user_id
GROUP BY p.email
ORDER BY red_tasks_count DESC
LIMIT 10;

-- Taxa de conclusão média por usuário
SELECT 
  p.email,
  COUNT(*) FILTER (WHERE rt.completed = true) * 100.0 / NULLIF(COUNT(*), 0) as completion_rate
FROM profiles p
LEFT JOIN red_tasks rt ON p.id = rt.user_id
GROUP BY p.email
HAVING COUNT(*) > 0
ORDER BY completion_rate DESC;
```

## 🔍 Debug de Problemas

### Verificar RLS

```sql
-- Ver políticas de uma tabela
SELECT * FROM pg_policies WHERE tablename = 'red_tasks';

-- Testar se RLS está ativo
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public';
```

### Verificar Triggers

```sql
-- Ver todos os triggers
SELECT trigger_name, event_manipulation, event_object_table
FROM information_schema.triggers
WHERE trigger_schema = 'public';
```

### Ver índices

```sql
-- Ver índices de uma tabela
SELECT indexname, indexdef
FROM pg_indexes
WHERE tablename = 'red_tasks';
```

## 💾 Migrations

### Criar nova migração

1. Crie arquivo: `/supabase/migrations/YYYYMMDD_description.sql`
2. Adicione o SQL
3. Execute no SQL Editor
4. Documente no git

Exemplo:

```sql
-- /supabase/migrations/20260304_add_tags_to_projects.sql

ALTER TABLE projects 
ADD COLUMN tags TEXT[];

CREATE INDEX idx_projects_tags ON projects USING GIN(tags);

COMMENT ON COLUMN projects.tags IS 'Array de tags para categorização';
```

## 🎯 Performance

### Queries lentas

```sql
-- Habilitar tracking de queries (só em dev)
ALTER DATABASE postgres SET log_statement = 'all';

-- Ver queries mais lentas (requer extensions)
SELECT calls, total_time, query 
FROM pg_stat_statements 
ORDER BY total_time DESC 
LIMIT 10;
```

### Otimizar tabelas

```sql
-- Vacuum e analyze (Supabase faz automaticamente)
VACUUM ANALYZE red_tasks;
VACUUM ANALYZE projects;
```

## 📱 Mobile - Queries Otimizadas

```sql
-- Carregar apenas dados recentes
SELECT * FROM red_tasks 
WHERE user_id = 'user-id' 
AND created_at > NOW() - INTERVAL '30 days'
LIMIT 50;

-- Paginação
SELECT * FROM journal_entries
WHERE user_id = 'user-id'
ORDER BY date DESC
LIMIT 10 OFFSET 0;  -- Próxima página: OFFSET 10
```

## 🔐 Segurança

### Verificar acesso não autorizado

```sql
-- Ver logs de autenticação (no Supabase Dashboard)
-- Logs > Auth

-- Revogar todas as sessões de um usuário
-- Dashboard > Authentication > Users > [usuário] > Sign Out All Sessions
```

### Atualizar políticas RLS

```sql
-- Exemplo: adicionar campo ao filtro
DROP POLICY "Users can manage own tasks" ON tasks;

CREATE POLICY "Users can manage own tasks" ON tasks
FOR ALL 
USING (
  auth.uid() = user_id 
  AND deleted_at IS NULL  -- Novo filtro
);
```

## 📈 Exportação

### Exportar todos os dados de produção

```bash
# Via Supabase CLI (se instalado)
supabase db dump > backup.sql

# Via Dashboard
# Database > Backups > Create Backup
```

### Importar dados

```bash
# Via Supabase CLI
supabase db reset --db-url "postgres://..."

# Via Dashboard
# SQL Editor > Colar SQL > Run
```

---

**Dica:** Salve suas queries frequentes no SQL Editor usando o botão "Save" para acesso rápido!
