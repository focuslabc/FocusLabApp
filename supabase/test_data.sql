-- Test Data for Focus Lab
-- OPCIONAL: Use apenas para testes
-- Este script adiciona dados de exemplo para testar o sistema

-- ATENÇÃO: Substitua 'SEU_USER_ID_AQUI' pelo ID real do seu usuário
-- Você pode pegar o ID em: Authentication > Users no Supabase Dashboard

-- Defina o user_id (substitua pelo ID real)
DO $$
DECLARE
  test_user_id UUID := 'SEU_USER_ID_AQUI'::UUID;
BEGIN

-- Criar Objeto de Foco
INSERT INTO focus_objectives (user_id, title, target_date, end_time, quarter)
VALUES (
  test_user_id,
  'Lançar meu primeiro produto digital',
  (CURRENT_DATE + INTERVAL '90 days')::DATE,
  '23:59',
  'Q2 2026'
);

-- Criar RED Tasks
INSERT INTO red_tasks (user_id, text, category, completed, position) VALUES
  (test_user_id, 'Meditar 10 minutos', 'Mind', false, 0),
  (test_user_id, 'Treino de 45 minutos', 'Bio', false, 1),
  (test_user_id, 'Deep Work 2h no projeto principal', 'Work', false, 2),
  (test_user_id, '3L de água', 'Bio', false, 3),
  (test_user_id, 'Leitura 20 páginas', 'Mind', false, 4);

-- Criar Tarefas Gerais
INSERT INTO tasks (user_id, text, category, completed, priority) VALUES
  (test_user_id, 'Responder emails importantes', 'comunicação', false, 'high'),
  (test_user_id, 'Revisar proposta comercial', 'trabalho', false, 'urgent'),
  (test_user_id, 'Ligar para a mãe', 'pessoal', false, 'medium'),
  (test_user_id, 'Agendar consulta médica', 'saúde', false, 'low');

-- Criar Projeto no Laboratório
INSERT INTO projects (user_id, title, content, status) VALUES
  (test_user_id, 
   'Produto Digital - MVP', 
   '# Planejamento do MVP

## Objetivos
- [ ] Validar ideia com 50 pessoas
- [ ] Criar landing page
- [ ] Desenvolver protótipo funcional
- [ ] 10 primeiros clientes pagantes

## Próximos Passos
1. Definir nicho exato
2. Pesquisar concorrência
3. Entrevistar potenciais clientes
4. Criar oferta irresistível',
   'active');

-- Criar Entrada no Diário
INSERT INTO journal_entries (user_id, date, content, mood, energy_level) VALUES
  (test_user_id,
   CURRENT_DATE,
   'Hoje consegui manter foco por 3h seguidas no projeto. Percebi que funciono melhor nas primeiras horas do dia. Preciso proteger esse horário de interrupções.',
   'produtivo',
   8);

-- Criar Desafios
INSERT INTO challenges (user_id, title, description, duration_days, status, icon) VALUES
  (test_user_id,
   'Jejum de Dopamina',
   'Reduza estímulos artificiais para recuperar a sensibilidade dos receptores.',
   7,
   'not_started',
   'Brain'),
  (test_user_id,
   'Detox Digital',
   'Zero redes sociais e telas não essenciais após as 18h.',
   3,
   'not_started',
   'Smartphone');

-- Criar Metas Semanais
INSERT INTO weekly_goals (user_id, week_start, week_end, goal, completed, progress) VALUES
  (test_user_id,
   DATE_TRUNC('week', CURRENT_DATE),
   DATE_TRUNC('week', CURRENT_DATE) + INTERVAL '6 days',
   'Completar 100% da RED todos os dias',
   false,
   60),
  (test_user_id,
   DATE_TRUNC('week', CURRENT_DATE),
   DATE_TRUNC('week', CURRENT_DATE) + INTERVAL '6 days',
   'Avançar 20h no projeto principal',
   false,
   40);

-- Criar Compromissos da Biblioteca
INSERT INTO library_commitments (user_id, video_title, category, commitment_text, deadline, completed) VALUES
  (test_user_id,
   'Como Vencer a Procrastinação - Andrew Huberman',
   'procrastination',
   'Implementar protocolo de 5 minutos: começar qualquer tarefa por apenas 5min sem compromisso de terminar',
   (CURRENT_DATE + INTERVAL '7 days')::DATE,
   false),
  (test_user_id,
   'Otimização de Dopamina - Dr. K',
   'dopamine',
   'Estabelecer pelo menos 1h de tédio intencional por dia sem estimulação digital',
   (CURRENT_DATE + INTERVAL '14 days')::DATE,
   false);

-- Criar Marcos da Jornada
INSERT INTO journey_milestones (user_id, title, description, target_date, completed, position) VALUES
  (test_user_id,
   'Fundação Sólida',
   'Estabelecer rotina RED consistente por 30 dias',
   (CURRENT_DATE + INTERVAL '30 days')::DATE,
   false,
   0),
  (test_user_id,
   'Primeiro Cliente',
   'Conseguir o primeiro cliente pagante',
   (CURRENT_DATE + INTERVAL '60 days')::DATE,
   false,
   1),
  (test_user_id,
   'MVP Lançado',
   'Lançar versão beta do produto',
   (CURRENT_DATE + INTERVAL '90 days')::DATE,
   false,
   2);

END $$;

-- Verificar dados criados
SELECT 'Focus Objectives' as tabela, COUNT(*) as registros FROM focus_objectives
UNION ALL
SELECT 'RED Tasks', COUNT(*) FROM red_tasks
UNION ALL
SELECT 'Tasks', COUNT(*) FROM tasks
UNION ALL
SELECT 'Projects', COUNT(*) FROM projects
UNION ALL
SELECT 'Journal Entries', COUNT(*) FROM journal_entries
UNION ALL
SELECT 'Challenges', COUNT(*) FROM challenges
UNION ALL
SELECT 'Weekly Goals', COUNT(*) FROM weekly_goals
UNION ALL
SELECT 'Library Commitments', COUNT(*) FROM library_commitments
UNION ALL
SELECT 'Journey Milestones', COUNT(*) FROM journey_milestones;
