// Custom hooks for Focus Lab data management
import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import * as api from '../lib/api';

// Hook for Focus Objective
export function useFocusObjective(userId: string | null) {
  const [objective, setObjective] = useState<api.FocusObjective | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    async function loadObjective() {
      const data = await api.getFocusObjective(userId);
      setObjective(data);
      setLoading(false);
    }

    loadObjective();
  }, [userId]);

  const updateObjective = useCallback(async (updates: Partial<api.FocusObjective>) => {
    if (!objective) return;
    const updated = await api.updateFocusObjective(objective.id, updates);
    if (updated) {
      setObjective(updated);
      toast.success('Objeto de foco atualizado');
    }
  }, [objective]);

  const createObjective = useCallback(async (data: Omit<api.FocusObjective, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    if (!userId) return;
    const created = await api.createFocusObjective(userId, data);
    if (created) {
      setObjective(created);
      toast.success('Objeto de foco criado');
    }
  }, [userId]);

  return { objective, loading, updateObjective, createObjective };
}

// Hook for RED Tasks
export function useRedTasks(userId: string | null) {
  const [tasks, setTasks] = useState<api.RedTask[]>([]);
  const [loading, setLoading] = useState(true);

  const loadTasks = useCallback(async () => {
    if (!userId) {
      setLoading(false);
      return;
    }
    const data = await api.getRedTasks(userId);
    setTasks(data);
    setLoading(false);
  }, [userId]);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  const addTask = useCallback(async (task: Omit<api.RedTask, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    if (!userId) {
      console.error('❌ addTask: userId não está definido');
      toast.error('Erro: Usuário não autenticado');
      return;
    }
    
    console.log('🚀 Adicionando tarefa RED:', task);
    console.log('👤 User ID:', userId);
    
    const created = await api.createRedTask(userId, task);
    
    if (created) {
      console.log('✅ Tarefa criada com sucesso:', created);
      setTasks(prev => [...prev, created]);
      toast.success('Tarefa RED adicionada');
    } else {
      console.error('❌ Falha ao criar tarefa - API retornou null');
      toast.error('Erro ao adicionar tarefa');
    }
  }, [userId]);

  const toggleTask = useCallback(async (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    const updated = await api.updateRedTask(id, {
      completed: !task.completed,
      completed_at: !task.completed ? new Date().toISOString() : undefined
    });

    if (updated) {
      setTasks(prev => prev.map(t => t.id === id ? updated : t));
    }
  }, [tasks]);

  const updateTask = useCallback(async (id: string, updates: Partial<api.RedTask>) => {
    const updated = await api.updateRedTask(id, updates);
    if (updated) {
      setTasks(prev => prev.map(t => t.id === id ? updated : t));
      toast.success('Tarefa atualizada');
    }
  }, []);

  const removeTask = useCallback(async (id: string) => {
    const success = await api.deleteRedTask(id);
    if (success) {
      setTasks(prev => prev.filter(t => t.id !== id));
      toast.success('Tarefa removida');
    }
  }, []);

  return { tasks, loading, addTask, toggleTask, updateTask, removeTask, refreshTasks: loadTasks };
}

// Hook for General Tasks
export function useTasks(userId: string | null) {
  const [tasks, setTasks] = useState<api.Task[]>([]);
  const [loading, setLoading] = useState(true);

  const loadTasks = useCallback(async () => {
    if (!userId) {
      setLoading(false);
      return;
    }
    const data = await api.getTasks(userId);
    setTasks(data);
    setLoading(false);
  }, [userId]);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  const addTask = useCallback(async (task: Omit<api.Task, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    if (!userId) return;
    const created = await api.createTask(userId, task);
    if (created) {
      setTasks(prev => [created, ...prev]);
      toast.success('Tarefa criada');
    }
  }, [userId]);

  const toggleTask = useCallback(async (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    const updated = await api.updateTask(id, {
      completed: !task.completed,
      completed_at: !task.completed ? new Date().toISOString() : undefined
    });

    if (updated) {
      setTasks(prev => prev.map(t => t.id === id ? updated : t));
    }
  }, [tasks]);

  const updateTask = useCallback(async (id: string, updates: Partial<api.Task>) => {
    const updated = await api.updateTask(id, updates);
    if (updated) {
      setTasks(prev => prev.map(t => t.id === id ? updated : t));
      toast.success('Tarefa atualizada');
    }
  }, []);

  const removeTask = useCallback(async (id: string) => {
    const success = await api.deleteTask(id);
    if (success) {
      setTasks(prev => prev.filter(t => t.id !== id));
      toast.success('Tarefa removida');
    }
  }, []);

  return { tasks, loading, addTask, toggleTask, updateTask, removeTask, refreshTasks: loadTasks };
}

// Hook for Projects
export function useProjects(userId: string | null) {
  const [projects, setProjects] = useState<api.Project[]>([]);
  const [loading, setLoading] = useState(true);

  const loadProjects = useCallback(async () => {
    if (!userId) {
      setLoading(false);
      return;
    }
    const data = await api.getProjects(userId);
    setProjects(data);
    setLoading(false);
  }, [userId]);

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  const addProject = useCallback(async (project: Omit<api.Project, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    if (!userId) return null;
    const created = await api.createProject(userId, project);
    if (created) {
      setProjects(prev => [created, ...prev]);
      toast.success('Projeto criado');
      return created;
    }
    return null;
  }, [userId]);

  const updateProject = useCallback(async (id: string, updates: Partial<api.Project>) => {
    const updated = await api.updateProject(id, updates);
    if (updated) {
      setProjects(prev => prev.map(p => p.id === id ? updated : p));
      toast.success('Projeto atualizado');
    }
  }, []);

  const removeProject = useCallback(async (id: string) => {
    const success = await api.deleteProject(id);
    if (success) {
      setProjects(prev => prev.filter(p => p.id !== id));
      toast.success('Projeto removido');
    }
  }, []);

  return { projects, loading, addProject, updateProject, removeProject, refreshProjects: loadProjects };
}

// Hook for Journal Entries
export function useJournal(userId: string | null) {
  const [entries, setEntries] = useState<api.JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const loadEntries = useCallback(async () => {
    if (!userId) {
      setLoading(false);
      return;
    }
    const data = await api.getJournalEntries(userId, 30); // Last 30 entries
    setEntries(data);
    setLoading(false);
  }, [userId]);

  useEffect(() => {
    loadEntries();
  }, [loadEntries]);

  const saveEntry = useCallback(async (entry: Omit<api.JournalEntry, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    if (!userId) return;
    const saved = await api.upsertJournalEntry(userId, entry);
    if (saved) {
      setEntries(prev => {
        const existing = prev.findIndex(e => e.date === saved.date);
        if (existing >= 0) {
          const updated = [...prev];
          updated[existing] = saved;
          return updated;
        }
        return [saved, ...prev];
      });
      toast.success('Entrada salva');
    }
  }, [userId]);

  const getEntryByDate = useCallback(async (date: string) => {
    if (!userId) return null;
    return await api.getJournalEntryByDate(userId, date);
  }, [userId]);

  return { entries, loading, saveEntry, getEntryByDate, refreshEntries: loadEntries };
}

// Hook for Challenges
export function useChallenges(userId: string | null) {
  const [challenges, setChallenges] = useState<api.Challenge[]>([]);
  const [loading, setLoading] = useState(true);

  const loadChallenges = useCallback(async () => {
    if (!userId) {
      setLoading(false);
      return;
    }
    const data = await api.getChallenges(userId);
    setChallenges(data);
    setLoading(false);
  }, [userId]);

  useEffect(() => {
    loadChallenges();
  }, [loadChallenges]);

  const addChallenge = useCallback(async (challenge: Omit<api.Challenge, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    if (!userId) return;
    const created = await api.createChallenge(userId, challenge);
    if (created) {
      setChallenges(prev => [created, ...prev]);
      toast.success('Desafio criado');
    }
  }, [userId]);

  const updateChallenge = useCallback(async (id: string, updates: Partial<api.Challenge>) => {
    const updated = await api.updateChallenge(id, updates);
    if (updated) {
      setChallenges(prev => prev.map(c => c.id === id ? updated : c));
      toast.success('Desafio atualizado');
    }
  }, []);

  const startChallenge = useCallback(async (id: string) => {
    const updated = await api.updateChallenge(id, {
      status: 'active',
      started_at: new Date().toISOString()
    });
    if (updated) {
      setChallenges(prev => prev.map(c => c.id === id ? updated : c));
      toast.success('Desafio iniciado!');
    }
  }, []);

  const completeChallenge = useCallback(async (id: string) => {
    const updated = await api.updateChallenge(id, {
      status: 'completed',
      completed_at: new Date().toISOString()
    });
    if (updated) {
      setChallenges(prev => prev.map(c => c.id === id ? updated : c));
      toast.success('Desafio concluído! 🎉');
    }
  }, []);

  return { challenges, loading, addChallenge, updateChallenge, startChallenge, completeChallenge, refreshChallenges: loadChallenges };
}

// Hook for Weekly Goals
export function useWeeklyGoals(userId: string | null) {
  const [goals, setGoals] = useState<api.WeeklyGoal[]>([]);
  const [loading, setLoading] = useState(true);

  const loadGoals = useCallback(async () => {
    if (!userId) {
      setLoading(false);
      return;
    }
    const data = await api.getWeeklyGoals(userId);
    setGoals(data);
    setLoading(false);
  }, [userId]);

  useEffect(() => {
    loadGoals();
  }, [loadGoals]);

  const addGoal = useCallback(async (goal: Omit<api.WeeklyGoal, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    if (!userId) return;
    const created = await api.createWeeklyGoal(userId, goal);
    if (created) {
      setGoals(prev => [created, ...prev]);
      toast.success('Meta semanal criada');
    }
  }, [userId]);

  const updateGoal = useCallback(async (id: string, updates: Partial<api.WeeklyGoal>) => {
    const updated = await api.updateWeeklyGoal(id, updates);
    if (updated) {
      setGoals(prev => prev.map(g => g.id === id ? updated : g));
      toast.success('Meta atualizada');
    }
  }, []);

  const removeGoal = useCallback(async (id: string) => {
    const success = await api.deleteWeeklyGoal(id);
    if (success) {
      setGoals(prev => prev.filter(g => g.id !== id));
      toast.success('Meta removida');
    }
  }, []);

  return { goals, loading, addGoal, updateGoal, removeGoal, refreshGoals: loadGoals };
}

// Hook for Library Commitments
export function useLibraryCommitments(userId: string | null) {
  const [commitments, setCommitments] = useState<api.LibraryCommitment[]>([]);
  const [loading, setLoading] = useState(true);

  const loadCommitments = useCallback(async () => {
    if (!userId) {
      setLoading(false);
      return;
    }
    const data = await api.getLibraryCommitments(userId);
    setCommitments(data);
    setLoading(false);
  }, [userId]);

  useEffect(() => {
    loadCommitments();
  }, [loadCommitments]);

  const addCommitment = useCallback(async (commitment: Omit<api.LibraryCommitment, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    if (!userId) return;
    const created = await api.createLibraryCommitment(userId, commitment);
    if (created) {
      setCommitments(prev => [created, ...prev]);
      toast.success('Compromisso registrado');
    }
  }, [userId]);

  const toggleCommitment = useCallback(async (id: string) => {
    const commitment = commitments.find(c => c.id === id);
    if (!commitment) return;

    const updated = await api.updateLibraryCommitment(id, {
      completed: !commitment.completed,
      completed_at: !commitment.completed ? new Date().toISOString() : undefined
    });

    if (updated) {
      setCommitments(prev => prev.map(c => c.id === id ? updated : c));
    }
  }, [commitments]);

  const removeCommitment = useCallback(async (id: string) => {
    const success = await api.deleteLibraryCommitment(id);
    if (success) {
      setCommitments(prev => prev.filter(c => c.id !== id));
      toast.success('Compromisso removido');
    }
  }, []);

  return { commitments, loading, addCommitment, toggleCommitment, removeCommitment, refreshCommitments: loadCommitments };
}

// Hook for Journey Milestones
export function useJourneyMilestones(userId: string | null) {
  const [milestones, setMilestones] = useState<api.JourneyMilestone[]>([]);
  const [loading, setLoading] = useState(true);

  const loadMilestones = useCallback(async () => {
    if (!userId) {
      setLoading(false);
      return;
    }
    const data = await api.getJourneyMilestones(userId);
    setMilestones(data);
    setLoading(false);
  }, [userId]);

  useEffect(() => {
    loadMilestones();
  }, [loadMilestones]);

  const addMilestone = useCallback(async (milestone: Omit<api.JourneyMilestone, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    if (!userId) return;
    const created = await api.createJourneyMilestone(userId, milestone);
    if (created) {
      setMilestones(prev => [...prev, created]);
      toast.success('Marco adicionado');
    }
  }, [userId]);

  const updateMilestone = useCallback(async (id: string, updates: Partial<api.JourneyMilestone>) => {
    const updated = await api.updateJourneyMilestone(id, updates);
    if (updated) {
      setMilestones(prev => prev.map(m => m.id === id ? updated : m));
      toast.success('Marco atualizado');
    }
  }, []);

  const toggleMilestone = useCallback(async (id: string) => {
    const milestone = milestones.find(m => m.id === id);
    if (!milestone) return;

    const updated = await api.updateJourneyMilestone(id, {
      completed: !milestone.completed,
      completed_at: !milestone.completed ? new Date().toISOString() : undefined
    });

    if (updated) {
      setMilestones(prev => prev.map(m => m.id === id ? updated : m));
    }
  }, [milestones]);

  const removeMilestone = useCallback(async (id: string) => {
    const success = await api.deleteJourneyMilestone(id);
    if (success) {
      setMilestones(prev => prev.filter(m => m.id !== id));
      toast.success('Marco removido');
    }
  }, []);

  return { milestones, loading, addMilestone, updateMilestone, toggleMilestone, removeMilestone, refreshMilestones: loadMilestones };
}