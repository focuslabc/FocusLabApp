# Guia de Integração - MVP Real

## ✅ O que foi criado

### 1. Schema do Banco de Dados (`/supabase/schema.sql`)
- Todas as tabelas necessárias para o Focus Lab
- Row Level Security (RLS) configurado
- Triggers automáticos
- Indexes para performance

### 2. API Service (`/src/lib/api.ts`)
- Funções CRUD completas para todas as entidades
- Type-safe com TypeScript
- Error handling integrado
- Sem dados mock - tudo real

### 3. Custom Hooks (`/src/hooks/useFocusLab.ts`)
- `useFocusObjective` - Gerencia objeto de foco
- `useRedTasks` - Tarefas do núcleo RED
- `useTasks` - Tarefas gerais
- `useProjects` - Laboratório de projetos
- `useJournal` - Diário de reconfiguração
- `useChallenges` - Desafios comportamentais
- `useWeeklyGoals` - Metas semanais
- `useLibraryCommitments` - Compromissos da biblioteca
- `useJourneyMilestones` - Marcos da jornada

## 🚀 Como Usar

### Passo 1: Configure o Banco
```bash
# 1. Acesse o Supabase Dashboard
# 2. Vá em SQL Editor
# 3. Copie o conteúdo de /supabase/schema.sql
# 4. Cole e execute (RUN)
```

### Passo 2: Exemplo de Uso nos Componentes

#### Antes (Mock Data):
```tsx
const [tasks, setTasks] = useState([
  { id: 1, text: 'Exemplo', category: 'Work', completed: false }
]);

const toggleTask = (id: number) => {
  setTasks(prev => prev.map(t => 
    t.id === id ? { ...t, completed: !t.completed } : t
  ));
};
```

#### Depois (Dados Reais):
```tsx
import { useRedTasks } from '../hooks/useFocusLab';

function MyComponent() {
  const { data: user } = supabase.auth.getUser();
  const { tasks, loading, toggleTask, addTask } = useRedTasks(user?.id || null);

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      {tasks.map(task => (
        <TaskItem 
          key={task.id}
          task={task}
          onToggle={() => toggleTask(task.id)}
        />
      ))}
    </div>
  );
}
```

### Passo 3: Atualizar App.tsx

No componente principal:

```tsx
function App() {
  const [user, setUser] = useState<any>(null);
  const [isOwner, setIsOwner] = useState(false);

  // Verificar sessão
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user?.email === 'cadecandidomartins@gmail.com') {
        setIsOwner(true);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  // Usar hooks para dados
  const userId = user?.id || null;
  const { objective, updateObjective } = useFocusObjective(userId);
  const { tasks: redTasks, toggleTask } = useRedTasks(userId);
  const { projects, addProject } = useProjects(userId);
  // ... outros hooks

  // Passar para os componentes filhos
}
```

## 📋 Checklist de Migração

### Views que precisam ser atualizadas:

- [ ] **RedView** - Usar `useRedTasks`
  - Substituir array local por hook
  - Implementar addTask, toggleTask, removeTask
  - Adicionar loading state

- [ ] **TasksView** - Usar `useTasks`
  - Mesma abordagem do RedView
  - Adicionar filtros (completed, priority)

- [ ] **LaboratoryView** - Usar `useProjects`
  - Lista de projetos real
  - Editor de conteúdo persistente
  - Status tracking

- [ ] **JournalView** - Usar `useJournal`
  - Salvar entradas por data
  - Carregar histórico
  - Analytics de padrões

- [ ] **ChallengesView** - Usar `useChallenges`
  - Sistema de desafios
  - Progress tracking
  - Start/complete actions

- [ ] **WeeklyGoalsView** - Usar `useWeeklyGoals`
  - Metas por semana
  - Progress percentage
  - Completion tracking

- [ ] **LibraryView** - Usar `useLibraryCommitments`
  - Registrar compromissos de vídeos
  - Marcar como completo
  - Deadline tracking

- [ ] **JourneyView** - Usar `useJourneyMilestones`
  - Visualização de marcos
  - Completar marcos
  - Timeline tracking

- [ ] **CommandCenterView**
  - Integrar com `useFocusObjective`
  - Dashboard com dados reais
  - Métricas calculadas

## 🎯 Padrão de Implementação

Para cada view, siga este padrão:

```tsx
import { use[Feature] } from '../hooks/useFocusLab';

function [Feature]View() {
  const { data: user } = supabase.auth.getUser();
  const userId = user?.id || null;
  
  const { 
    items,           // dados
    loading,         // estado de carregamento
    addItem,         // criar
    updateItem,      // atualizar
    removeItem       // deletar
  } = use[Feature](userId);

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-8 h-8 animate-spin text-red-600" />
      </div>
    );
  }

  // Empty state
  if (items.length === 0) {
    return <EmptyState onAdd={() => {/* ... */}} />;
  }

  // Render normal
  return (
    <div>
      {items.map(item => (
        <ItemComponent key={item.id} item={item} />
      ))}
    </div>
  );
}
```

## 🔒 Segurança

- ✅ RLS habilitado em todas as tabelas
- ✅ Cada usuário vê apenas seus dados
- ✅ Políticas de INSERT/UPDATE/DELETE configuradas
- ✅ Owner detection automática para `cadecandidomartins@gmail.com`

## 📊 Performance

- Indexes criados para queries frequentes
- Queries otimizadas com select específicos
- Paginação onde necessário (journal entries)
- Real-time opcional (pode ser adicionado depois)

## 🐛 Debug

Para verificar se está funcionando:

```tsx
// Adicione logs temporários
useEffect(() => {
  console.log('User ID:', userId);
  console.log('Tasks loaded:', tasks);
}, [userId, tasks]);
```

Verifique no console:
1. Se o userId está definido após login
2. Se os dados estão sendo carregados
3. Se há erros nas chamadas

## ⚡ Próximos Passos

1. **Execute o schema.sql no Supabase**
2. **Teste criar um usuário novo**
3. **Verifique se o perfil foi criado automaticamente**
4. **Comece a migrar uma view por vez**
5. **Teste cada funcionalidade antes de prosseguir**

## 💡 Dicas

- **Não delete o código antigo imediatamente** - comente primeiro
- **Teste incrementalmente** - migre uma view por vez
- **Use o toast para feedback** - já está integrado nos hooks
- **Verifique o Supabase Dashboard** - veja os dados sendo criados
- **Use o SQL Editor** para debug - queries diretas quando necessário

## 🎉 Resultado

Após a migração completa, você terá:
- ✅ Dados persistentes no Supabase
- ✅ Multi-usuário funcionando
- ✅ Segurança com RLS
- ✅ Performance otimizada
- ✅ Pronto para produção
- ✅ Zero mock data
