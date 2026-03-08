// Focus Lab API Service - KV Store Integration

import * as kv from '/supabase/functions/server/kv_store';
import { toast } from 'sonner';

// Types
export interface Profile {
  id: string;
  email: string;
  name?: string;
  is_owner: boolean;
  created_at: string;
  updated_at: string;
}

export interface FocusObjective {
  id: string;
  user_id: string;
  title: string;
  target_date: string;
  end_time?: string;
  quarter?: string;
  created_at: string;
  updated_at: string;
}

export interface RedTask {
  id: string;
  user_id: string;
  text: string;
  category: 'Bio' | 'Mind' | 'Work' | 'Outro';
  completed: boolean;
  completed_at?: string;
  position: number;
  created_at: string;
  updated_at: string;
}

export interface Task {
  id: string;
  user_id: string;
  text: string;
  category?: string;
  completed: boolean;
  completed_at?: string;
  due_date?: string;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: string;
  user_id: string;
  title: string;
  content?: string;
  status: 'active' | 'paused' | 'completed' | 'archived';
  created_at: string;
  updated_at: string;
}

export interface JournalEntry {
  id: string;
  user_id: string;
  date: string;
  content?: string;
  mood?: string;
  energy_level?: number;
  created_at: string;
  updated_at: string;
}

export interface Challenge {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  duration_days: number;
  started_at?: string;
  completed_at?: string;
  status: 'not_started' | 'active' | 'completed' | 'failed';
  icon?: string;
  created_at: string;
  updated_at: string;
}

export interface WeeklyGoal {
  id: string;
  user_id: string;
  week_start: string;
  week_end: string;
  goal: string;
  completed: boolean;
  progress: number;
  created_at: string;
  updated_at: string;
}

export interface LibraryCommitment {
  id: string;
  user_id: string;
  video_title: string;
  video_url?: string;
  category: string;
  commitment_text: string;
  deadline?: string;
  completed: boolean;
  completed_at?: string;
  created_at: string;
  updated_at: string;
}

export interface JourneyMilestone {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  target_date?: string;
  completed: boolean;
  completed_at?: string;
  position: number;
  created_at: string;
  updated_at: string;
}

const generateId = (userId: string) => `${userId}_${crypto.randomUUID()}`;
const extractUserId = (id: string) => id.split('_')[0];

// === PROFILE ===
export async function getProfile(userId: string): Promise<Profile | null> {
  const key = `profile:${userId}`;
  const data = await kv.get(key);
  return data || null;
}

export async function updateProfile(userId: string, updates: Partial<Profile>): Promise<Profile | null> {
  const key = `profile:${userId}`;
  const existing = await kv.get(key) || { id: userId, created_at: new Date().toISOString() };
  const updated = { ...existing, ...updates, updated_at: new Date().toISOString() };
  await kv.set(key, updated);
  return updated;
}

// === FOCUS OBJECTIVES ===
export async function getFocusObjective(userId: string): Promise<FocusObjective | null> {
  const key = `focus_objective:${userId}`;
  const data = await kv.get(key);
  return data || null;
}

export async function createFocusObjective(userId: string, objective: Omit<FocusObjective, 'id' | 'user_id' | 'created_at' | 'updated_at'>): Promise<FocusObjective | null> {
  const key = `focus_objective:${userId}`;
  const newObjective: FocusObjective = {
    ...objective,
    id: generateId(userId),
    user_id: userId,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  await kv.set(key, newObjective);
  return newObjective;
}

export async function updateFocusObjective(id: string, updates: Partial<FocusObjective>): Promise<FocusObjective | null> {
  const userId = extractUserId(id);
  const key = `focus_objective:${userId}`;
  const existing = await kv.get(key);
  if (!existing || existing.id !== id) return null;
  
  const updated = { ...existing, ...updates, updated_at: new Date().toISOString() };
  await kv.set(key, updated);
  return updated;
}

// === RED TASKS ===
export async function getRedTasks(userId: string): Promise<RedTask[]> {
  const tasks = await kv.getByPrefix(`red_tasks:${userId}:`);
  return tasks.sort((a: any, b: any) => a.position - b.position);
}

export async function createRedTask(userId: string, task: Omit<RedTask, 'id' | 'user_id' | 'created_at' | 'updated_at'>): Promise<RedTask | null> {
  const id = generateId(userId);
  const newTask: RedTask = {
    ...task,
    id,
    user_id: userId,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  await kv.set(`red_tasks:${userId}:${id}`, newTask);
  return newTask;
}

export async function updateRedTask(id: string, updates: Partial<RedTask>): Promise<RedTask | null> {
  const userId = extractUserId(id);
  const key = `red_tasks:${userId}:${id}`;
  const existing = await kv.get(key);
  if (!existing) return null;
  
  const updated = { ...existing, ...updates, updated_at: new Date().toISOString() };
  await kv.set(key, updated);
  return updated;
}

export async function deleteRedTask(id: string): Promise<boolean> {
  const userId = extractUserId(id);
  const key = `red_tasks:${userId}:${id}`;
  await kv.del(key);
  return true;
}

// === TASKS ===
export async function getTasks(userId: string): Promise<Task[]> {
  const tasks = await kv.getByPrefix(`tasks:${userId}:`);
  return tasks.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
}

export async function createTask(userId: string, task: Omit<Task, 'id' | 'user_id' | 'created_at' | 'updated_at'>): Promise<Task | null> {
  const id = generateId(userId);
  const newTask: Task = {
    ...task,
    id,
    user_id: userId,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  await kv.set(`tasks:${userId}:${id}`, newTask);
  return newTask;
}

export async function updateTask(id: string, updates: Partial<Task>): Promise<Task | null> {
  const userId = extractUserId(id);
  const key = `tasks:${userId}:${id}`;
  const existing = await kv.get(key);
  if (!existing) return null;
  
  const updated = { ...existing, ...updates, updated_at: new Date().toISOString() };
  await kv.set(key, updated);
  return updated;
}

export async function deleteTask(id: string): Promise<boolean> {
  const userId = extractUserId(id);
  const key = `tasks:${userId}:${id}`;
  await kv.del(key);
  return true;
}

// === PROJECTS ===
export async function getProjects(userId: string): Promise<Project[]> {
  const projects = await kv.getByPrefix(`projects:${userId}:`);
  return projects.sort((a: any, b: any) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());
}

export async function createProject(userId: string, project: Omit<Project, 'id' | 'user_id' | 'created_at' | 'updated_at'>): Promise<Project | null> {
  const id = generateId(userId);
  const newProject: Project = {
    ...project,
    id,
    user_id: userId,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  await kv.set(`projects:${userId}:${id}`, newProject);
  return newProject;
}

export async function updateProject(id: string, updates: Partial<Project>): Promise<Project | null> {
  const userId = extractUserId(id);
  const key = `projects:${userId}:${id}`;
  const existing = await kv.get(key);
  if (!existing) return null;
  
  const updated = { ...existing, ...updates, updated_at: new Date().toISOString() };
  await kv.set(key, updated);
  return updated;
}

export async function deleteProject(id: string): Promise<boolean> {
  const userId = extractUserId(id);
  const key = `projects:${userId}:${id}`;
  await kv.del(key);
  return true;
}

// === JOURNAL ENTRIES ===
export async function getJournalEntries(userId: string, limit?: number): Promise<JournalEntry[]> {
  const entries = await kv.getByPrefix(`journal:${userId}:`);
  const sorted = entries.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());
  return limit ? sorted.slice(0, limit) : sorted;
}

export async function getJournalEntryByDate(userId: string, date: string): Promise<JournalEntry | null> {
  // Try finding it
  const entries = await kv.getByPrefix(`journal:${userId}:`);
  const existing = entries.find((e: any) => e.date === date);
  return existing || null;
}

export async function upsertJournalEntry(userId: string, entry: Omit<JournalEntry, 'id' | 'user_id' | 'created_at' | 'updated_at'>): Promise<JournalEntry | null> {
  const entries = await kv.getByPrefix(`journal:${userId}:`);
  let existing = entries.find((e: any) => e.date === entry.date);
  
  const id = existing?.id || generateId(userId);
  const key = `journal:${userId}:${id}`;
  
  const updated: JournalEntry = {
    ...existing,
    ...entry,
    id,
    user_id: userId,
    created_at: existing?.created_at || new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  
  await kv.set(key, updated);
  return updated;
}

// === CHALLENGES ===
export async function getChallenges(userId: string): Promise<Challenge[]> {
  const challenges = await kv.getByPrefix(`challenges:${userId}:`);
  return challenges.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
}

export async function createChallenge(userId: string, challenge: Omit<Challenge, 'id' | 'user_id' | 'created_at' | 'updated_at'>): Promise<Challenge | null> {
  const id = generateId(userId);
  const newChallenge: Challenge = {
    ...challenge,
    id,
    user_id: userId,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  await kv.set(`challenges:${userId}:${id}`, newChallenge);
  return newChallenge;
}

export async function updateChallenge(id: string, updates: Partial<Challenge>): Promise<Challenge | null> {
  const userId = extractUserId(id);
  const key = `challenges:${userId}:${id}`;
  const existing = await kv.get(key);
  if (!existing) return null;
  
  const updated = { ...existing, ...updates, updated_at: new Date().toISOString() };
  await kv.set(key, updated);
  return updated;
}

// === WEEKLY GOALS ===
export async function getWeeklyGoals(userId: string): Promise<WeeklyGoal[]> {
  const goals = await kv.getByPrefix(`weekly_goals:${userId}:`);
  return goals.sort((a: any, b: any) => new Date(b.week_start).getTime() - new Date(a.week_start).getTime());
}

export async function createWeeklyGoal(userId: string, goal: Omit<WeeklyGoal, 'id' | 'user_id' | 'created_at' | 'updated_at'>): Promise<WeeklyGoal | null> {
  const id = generateId(userId);
  const newGoal: WeeklyGoal = {
    ...goal,
    id,
    user_id: userId,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  await kv.set(`weekly_goals:${userId}:${id}`, newGoal);
  return newGoal;
}

export async function updateWeeklyGoal(id: string, updates: Partial<WeeklyGoal>): Promise<WeeklyGoal | null> {
  const userId = extractUserId(id);
  const key = `weekly_goals:${userId}:${id}`;
  const existing = await kv.get(key);
  if (!existing) return null;
  
  const updated = { ...existing, ...updates, updated_at: new Date().toISOString() };
  await kv.set(key, updated);
  return updated;
}

export async function deleteWeeklyGoal(id: string): Promise<boolean> {
  const userId = extractUserId(id);
  const key = `weekly_goals:${userId}:${id}`;
  await kv.del(key);
  return true;
}

// === LIBRARY COMMITMENTS ===
export async function getLibraryCommitments(userId: string): Promise<LibraryCommitment[]> {
  const commitments = await kv.getByPrefix(`library_commitments:${userId}:`);
  return commitments.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
}

export async function createLibraryCommitment(userId: string, commitment: Omit<LibraryCommitment, 'id' | 'user_id' | 'created_at' | 'updated_at'>): Promise<LibraryCommitment | null> {
  const id = generateId(userId);
  const newCommitment: LibraryCommitment = {
    ...commitment,
    id,
    user_id: userId,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  await kv.set(`library_commitments:${userId}:${id}`, newCommitment);
  return newCommitment;
}

export async function updateLibraryCommitment(id: string, updates: Partial<LibraryCommitment>): Promise<LibraryCommitment | null> {
  const userId = extractUserId(id);
  const key = `library_commitments:${userId}:${id}`;
  const existing = await kv.get(key);
  if (!existing) return null;
  
  const updated = { ...existing, ...updates, updated_at: new Date().toISOString() };
  await kv.set(key, updated);
  return updated;
}

export async function deleteLibraryCommitment(id: string): Promise<boolean> {
  const userId = extractUserId(id);
  const key = `library_commitments:${userId}:${id}`;
  await kv.del(key);
  return true;
}

// === JOURNEY MILESTONES ===
export async function getJourneyMilestones(userId: string): Promise<JourneyMilestone[]> {
  const milestones = await kv.getByPrefix(`journey_milestones:${userId}:`);
  return milestones.sort((a: any, b: any) => a.position - b.position);
}

export async function createJourneyMilestone(userId: string, milestone: Omit<JourneyMilestone, 'id' | 'user_id' | 'created_at' | 'updated_at'>): Promise<JourneyMilestone | null> {
  const id = generateId(userId);
  const newMilestone: JourneyMilestone = {
    ...milestone,
    id,
    user_id: userId,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  await kv.set(`journey_milestones:${userId}:${id}`, newMilestone);
  return newMilestone;
}

export async function updateJourneyMilestone(id: string, updates: Partial<JourneyMilestone>): Promise<JourneyMilestone | null> {
  const userId = extractUserId(id);
  const key = `journey_milestones:${userId}:${id}`;
  const existing = await kv.get(key);
  if (!existing) return null;
  
  const updated = { ...existing, ...updates, updated_at: new Date().toISOString() };
  await kv.set(key, updated);
  return updated;
}

export async function deleteJourneyMilestone(id: string): Promise<boolean> {
  const userId = extractUserId(id);
  const key = `journey_milestones:${userId}:${id}`;
  await kv.del(key);
  return true;
}
