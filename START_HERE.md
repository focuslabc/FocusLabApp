# 🚀 Focus Lab - Início Rápido (MVP Real)

## 📁 Arquivos Criados

Foram criados os seguintes arquivos para transformar o Focus Lab em MVP real:

### 1. Banco de Dados
- **`/supabase/schema.sql`** ⭐ PRINCIPAL - Execute este primeiro!
- **`/supabase/test_data.sql`** - Dados de teste (opcional)

### 2. Código
- **`/src/lib/api.ts`** - Funções para comunicar com Supabase
- **`/src/hooks/useFocusLab.ts`** - Hooks React prontos para usar
- **`/src/app/components/RedViewReal.tsx`** - Exemplo de componente com dados reais

### 3. Documentação
- **`/MVP_READY.md`** - Guia completo do MVP
- **`/DATABASE_SETUP.md`** - Configuração detalhada do banco
- **`/INTEGRATION_GUIDE.md`** - Como migrar os componentes
- **`/QUICK_COMMANDS.md`** - Comandos SQL úteis
- **`/START_HERE.md`** - Este arquivo (início rápido)

## ⚡ Setup em 3 Passos

### PASSO 1: Execute o Schema SQL (5 minutos)

1. Abra o [Supabase Dashboard](https://supabase.com)
2. Entre no seu projeto Focus Lab
3. Vá em **SQL Editor** (menu lateral esquerdo)
4. Clique em **New Query**
5. Abra o arquivo **`/supabase/schema.sql`**
6. **Copie TODO o conteúdo** (Ctrl+A, Ctrl+C)
7. Cole no editor do Supabase
8. Clique em **RUN** (ou Ctrl/Cmd + Enter)
9. Aguarde a mensagem de sucesso ✅

### PASSO 2: Teste o Sistema (2 minutos)

1. Recarregue a aplicação Focus Lab
2. Faça cadastro de um novo usuário
3. Faça login
4. Vá no **Table Editor** do Supabase
5. Clique em **profiles** - você verá seu perfil criado automaticamente!
6. Adicione uma tarefa RED no app
7. Vá em **red_tasks** no Supabase - a tarefa está lá! 🎉

### PASSO 3: Migre os Componentes (1-2 horas)

Use o exemplo em `/src/app/components/RedViewReal.tsx` como base.

**Padrão simples:**

```tsx
// 1. Importar o hook
import { useRedTasks } from '../../hooks/useFocusLab';
import { supabase } from '../../lib/supabase';

function MeuComponente() {
  // 2. Pegar o usuário
  const [user, setUser] = useState<any>(null);
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });
  }, []);

  // 3. Usar o hook
  const userId = user?.id || null;
  const { tasks, loading, addTask, toggleTask } = useRedTasks(userId);

  // 4. Renderizar
  if (loading) return <div>Carregando...</div>;
  
  return (
    <div>
      {tasks.map(task => (
        <div key={task.id} onClick={() => toggleTask(task.id)}>
          {task.text}
        </div>
      ))}
    </div>
  );
}
```

## ✅ Checklist Rápido

- [ ] Schema SQL executado no Supabase
- [ ] Tabelas criadas (verificar no Table Editor)
- [ ] Cadastro de usuário funcionando
- [ ] Perfil criado automaticamente
- [ ] Testei adicionar uma tarefa RED
- [ ] Tarefa apareceu no banco de dados
- [ ] Li o exemplo em `RedViewReal.tsx`
- [ ] Entendi como usar os hooks

## 🎯 O Que Mudou

### ANTES (Protótipo)
```tsx
// Dados ficavam apenas no state local
const [tasks, setTasks] = useState([
  { id: 1, text: 'Exemplo', completed: false }
]);

// Perdia tudo ao recarregar a página
```

### DEPOIS (MVP Real)
```tsx
// Dados vêm do Supabase
const { tasks, addTask, toggleTask } = useRedTasks(userId);

// Persiste automaticamente
// Multi-usuário
// Seguro com RLS
// Sincronizado
```

## 🔥 Principais Mudanças

1. **Dados Persistentes** - Nada se perde ao recarregar
2. **Multi-usuário** - Cada pessoa vê apenas seus dados
3. **Segurança** - RLS protege contra acesso não autorizado
4. **Real-time** - Possível adicionar sincronização ao vivo (opcional)
5. **Escalável** - Suporta milhares de usuários

## 📊 Estrutura do Banco

O schema criou 12 tabelas:

1. **profiles** - Perfil do usuário (nome, email, is_owner)
2. **focus_objectives** - Objetivos trimestrais
3. **red_tasks** - Tarefas do núcleo RED
4. **tasks** - Tarefas gerais
5. **projects** - Laboratório de projetos
6. **journal_entries** - Diário de reconfiguração
7. **challenges** - Desafios comportamentais
8. **challenge_progress** - Progresso dos desafios
9. **weekly_goals** - Metas semanais
10. **library_commitments** - Compromissos da biblioteca
11. **journey_milestones** - Marcos da jornada
12. **coworking_sessions** - Sessões de co-working

## 🛠️ Hooks Disponíveis

Todos em `/src/hooks/useFocusLab.ts`:

- `useFocusObjective(userId)` - Objeto de foco trimestral
- `useRedTasks(userId)` - Tarefas RED (CRUD completo)
- `useTasks(userId)` - Tarefas gerais
- `useProjects(userId)` - Projetos do laboratório
- `useJournal(userId)` - Diário de reconfiguração
- `useChallenges(userId)` - Sistema de desafios
- `useWeeklyGoals(userId)` - Metas semanais
- `useLibraryCommitments(userId)` - Biblioteca estratégica
- `useJourneyMilestones(userId)` - Modo jornada

Cada hook retorna:
- `data` - Os dados
- `loading` - Estado de carregamento
- `add*` - Criar novo item
- `update*` - Atualizar item
- `remove*` / `delete*` - Deletar item
- `toggle*` - Toggle completed (quando aplicável)
- `refresh*` - Recarregar dados

## 🎨 Exemplo Completo

Veja `/src/app/components/RedViewReal.tsx` para um exemplo completo incluindo:

- ✅ Loading states
- ✅ Empty states
- ✅ Formulários de criação
- ✅ Toggle de conclusão
- ✅ Deleção de items
- ✅ Animações smooth
- ✅ Feedback visual
- ✅ Toasts de sucesso/erro

## 🐛 Resolução de Problemas

### ⚠️ Erro 403 "Edge Functions Deploy"

**PODE IGNORAR!** Este erro aparece mas NÃO afeta o funcionamento:

```
Error while deploying: XHR for "...edge_functions..." failed with status 403
```

- ✅ A aplicação funciona normalmente
- ✅ Dados são salvos corretamente
- ✅ Autenticação funciona
- ❌ Edge functions NÃO são usadas no Focus Lab

**Leia:** `/EDGE_FUNCTIONS_ERROR_FIX.md` para entender por quê.

### Não vejo os dados

1. Verifique o console: `console.log(userId, tasks)`
2. Confirme que está logado
3. Veja o Network tab para erros
4. Teste a query no SQL Editor do Supabase

### Erro ao salvar

1. Verifique se todos os campos obrigatórios estão preenchidos
2. Veja o erro exato no console
3. Teste no SQL Editor: `INSERT INTO red_tasks (...) VALUES (...)`
4. Confirme que RLS está correto

### Loading infinito

1. Verifique se userId não é null
2. Veja se o hook está sendo chamado corretamente
3. Teste a query diretamente no Supabase
4. Adicione logs para debug

## 📚 Próximos Passos

1. ✅ Execute o schema SQL
2. ✅ Teste criar um usuário
3. ✅ Veja os dados no Supabase
4. 🔄 Migre RedView usando o exemplo
5. 🔄 Migre TasksView
6. 🔄 Migre LaboratoryView
7. 🔄 Migre JournalView
8. 🔄 Migre ChallengesView
9. 🔄 Migre WeeklyGoalsView
10. 🔄 Migre LibraryView
11. 🔄 Migre JourneyView
12. 🔄 Atualize CommandCenterView

## 🎉 Resultado Final

Após completar, você terá:

✅ Sistema 100% funcional  
✅ Dados persistentes e seguros  
✅ Multi-usuário pronto  
✅ Zero código fictício  
✅ Pronto para usuários reais  
✅ Escalável para milhares de pessoas  
✅ Production-ready  

## 📖 Documentação Detalhada

- **MVP_READY.md** - Guia completo e detalhado
- **DATABASE_SETUP.md** - Estrutura do banco explicada
- **INTEGRATION_GUIDE.md** - Passo a passo da migração
- **QUICK_COMMANDS.md** - SQL úteis para o dia a dia

## 💡 Dica de Ouro

**Migre componente por componente!** Não tente fazer tudo de uma vez.

1. Comece com RedView (mais simples)
2. Teste bem antes de prosseguir
3. Use o mesmo padrão nos outros
4. Mantenha o código antigo comentado (não delete)
5. Teste cada funcionalidade após migrar

## 🚀 Vamos Começar!

1. Abra o Supabase Dashboard
2. Copie e execute `/supabase/schema.sql`
3. Teste criar um usuário
4. Veja a mágica acontecer! ✨

**Qualquer dúvida, consulte os arquivos de documentação detalhada.**

---

**Focus Lab MVP Real - Pronto para Execução** 🎯
