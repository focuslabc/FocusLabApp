import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Flame, Target, BookOpen, Zap, Map, Shield, Check, Lock,
  ArrowRight, Atom, X, BarChart3, Brain, Clock
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function JourneyView() {
  const [journeyModal, setJourneyModal] = useState<'streak' | 'challenges' | 'content' | 'level' | 'insights' | null>(null);
  const [selectedTimelineItem, setSelectedTimelineItem] = useState<number | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<number | null>(null);

  const timelineItems = [
    { date: 'Hoje', title: 'Ativação do Protocolo Anti-Queda Vespertina', desc: 'Implementado baseado em análise do Diário de Reconfiguração', icon: Shield, color: 'red', details: 'Protocolo implementado às 14h30. Inclui alarme às 16h para ativação de deep work de 90min, evitando queda de energia vespertina. Baseado em padrões identificados nos últimos 7 dias do Diário.' },
    { date: '2 dias atrás', title: 'Compromisso de Ação: Atomic Habits', desc: 'Registrado sistema de stacking de hábitos', icon: BookOpen, color: 'blue', details: 'Compromisso: Implementar stacking conectando 15min de leitura após café da manhã. Prazo: 48h. Status: Em execução. Progresso: 2/2 dias cumpridos.' },
    { date: '5 dias atrás', title: 'Desafio Concluído: Leitura Diária (21 dias)', desc: 'Primeiro desafio de longo prazo completado', icon: Check, color: 'emerald', details: 'Desafio completado com 21/21 dias de leitura (mínimo 20 páginas/dia). Total: 487 páginas lidas. Livros consumidos: Atomic Habits (completo), Deep Work (50%). Recompensa: +15 pontos de Nível.' },
    { date: '12 dias atrás', title: 'Nível Alcançado: Operador', desc: 'Evolução de Iniciante para Operador', icon: Zap, color: 'purple', details: 'Progressão de nível conquistada após 11 dias de consistência. Requisitos cumpridos: 10+ dias de RED completo, 3+ desafios ativos, 5+ compromissos de ação registrados. Novas funcionalidades desbloqueadas: Co-working virtual, Diário com IA.' },
    { date: '23 dias atrás', title: 'Início da Jornada no Focus Lab', desc: 'Primeiro acesso ao sistema', icon: Atom, color: 'zinc', details: 'Primeira sessão no Focus Lab. Configuração inicial: Objeto de Foco Trimestral definido, RED básico criado com 5 tarefas, primeiro desafio ativado (Detox Digital 3 dias).' }
  ];

  const levels = [
    { level: 'Iniciante', desc: '0-10 dias', status: 'completed', icon: '🔴', requirements: ['Complete 3 dias de RED', 'Ative 1 desafio'], rewards: ['Acesso ao Laboratório', 'Diário de Reconfiguração'] },
    { level: 'Operador', desc: '11-30 dias', status: 'current', icon: '🟠', requirements: ['10+ dias de consistência', '3+ desafios ativos', '5+ compromissos de ação'], rewards: ['Co-working Virtual', 'Análise com IA', 'Protocolo Anti-Queda'] },
    { level: 'Executor', desc: '31-60 dias', status: 'locked', icon: '🟡', requirements: ['30+ dias de RED completo', '2 desafios longos (21d+)', '15+ compromissos cumpridos'], rewards: ['Modo Focus Intensivo', 'Biblioteca Premium', 'Mentoria Estratégica'] },
    { level: 'Arquiteto', desc: '61-120 dias', status: 'locked', icon: '🟢', requirements: ['60+ dias de streak', 'Objeto Trimestral alcançado', '50+ horas de conteúdo'], rewards: ['Sistema de Automação', 'Acesso a Experts', 'Templates Personalizados'] },
    { level: 'Mestre', desc: '120+ dias', status: 'locked', icon: '⚡', requirements: ['120+ dias de consistência', '5 objetos trimestrais alcançados', 'Transformação documentada'], rewards: ['Status de Mestre', 'Acesso vitalício', 'Programa de Mentoria'] }
  ];

  return (
    <div className="h-full overflow-y-auto p-8 lg:p-12">
      <div className="w-full max-w-7xl mx-auto">
        {/* Header with Insights Button */}
        <div className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Modo Jornada</h1>
            <p className="text-zinc-500 font-medium">Visualização de evolução e marcos da sua trajetória.</p>
          </div>
          <button 
            onClick={() => setJourneyModal('insights')}
            className="px-6 py-3 bg-red-900/20 hover:bg-red-900/30 border border-red-600/50 rounded-xl text-red-400 font-bold text-sm uppercase tracking-wider transition-all flex items-center gap-2"
          >
            <BarChart3 className="w-4 h-4" />
            Ver Insights
          </button>
        </div>

        {/* Stats Overview - Now Clickable */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <button 
            onClick={() => setJourneyModal('streak')}
            className="bg-black/20 border border-white/5 hover:border-red-600/30 rounded-2xl p-6 backdrop-blur-sm transition-all text-left group cursor-pointer"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-red-900/20 rounded-xl flex items-center justify-center group-hover:bg-red-900/30 transition-colors">
                <Flame className="w-5 h-5 text-red-500" />
              </div>
              <div>
                <p className="text-xs text-zinc-500 uppercase font-bold tracking-widest">Sequência Atual</p>
                <p className="text-2xl font-bold text-white">23 dias</p>
              </div>
            </div>
            <div className="h-1 bg-white/5 rounded-full overflow-hidden">
              <div className="h-full bg-red-600 rounded-full" style={{width: '76%'}} />
            </div>
          </button>

          <button 
            onClick={() => setJourneyModal('challenges')}
            className="bg-black/20 border border-white/5 hover:border-emerald-600/30 rounded-2xl p-6 backdrop-blur-sm transition-all text-left group cursor-pointer"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-emerald-900/20 rounded-xl flex items-center justify-center group-hover:bg-emerald-900/30 transition-colors">
                <Target className="w-5 h-5 text-emerald-500" />
              </div>
              <div>
                <p className="text-xs text-zinc-500 uppercase font-bold tracking-widest">Desafios Concluídos</p>
                <p className="text-2xl font-bold text-white">12</p>
              </div>
            </div>
            <p className="text-xs text-zinc-600">5 ativos agora</p>
          </button>

          <button 
            onClick={() => setJourneyModal('content')}
            className="bg-black/20 border border-white/5 hover:border-blue-600/30 rounded-2xl p-6 backdrop-blur-sm transition-all text-left group cursor-pointer"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-blue-900/20 rounded-xl flex items-center justify-center group-hover:bg-blue-900/30 transition-colors">
                <BookOpen className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <p className="text-xs text-zinc-500 uppercase font-bold tracking-widest">Conteúdo Consumido</p>
                <p className="text-2xl font-bold text-white">47h</p>
              </div>
            </div>
            <p className="text-xs text-zinc-600">8 cursos, 5 livros</p>
          </button>

          <button 
            onClick={() => setJourneyModal('level')}
            className="bg-black/20 border border-white/5 hover:border-purple-600/30 rounded-2xl p-6 backdrop-blur-sm transition-all text-left group cursor-pointer"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-purple-900/20 rounded-xl flex items-center justify-center group-hover:bg-purple-900/30 transition-colors">
                <Zap className="w-5 h-5 text-purple-500" />
              </div>
              <div>
                <p className="text-xs text-zinc-500 uppercase font-bold tracking-widest">Nível Atual</p>
                <p className="text-2xl font-bold text-white">Operador</p>
              </div>
            </div>
            <div className="h-1 bg-white/5 rounded-full overflow-hidden">
              <div className="h-full bg-purple-600 rounded-full" style={{width: '45%'}} />
            </div>
          </button>
        </div>

        {/* Timeline Section - Now Clickable */}
        <div className="bg-black/20 border border-white/5 rounded-3xl p-8 backdrop-blur-sm mb-8">
          <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
            <Map className="w-5 h-5 text-red-500" />
            Timeline de Evolução
          </h3>
          
          <div className="space-y-6 relative">
            {/* Vertical Line */}
            <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-red-600 via-red-900 to-transparent" />
            
            {/* Timeline Items */}
            {timelineItems.map((item, i) => (
              <button
                key={i}
                onClick={() => setSelectedTimelineItem(i)}
                className="relative flex gap-4 pl-16 w-full text-left hover:bg-white/5 rounded-xl p-2 -ml-2 transition-colors group cursor-pointer"
              >
                <div className={cn(
                  "absolute left-2 w-12 h-12 rounded-xl flex items-center justify-center shadow-lg transition-all group-hover:scale-110",
                  item.color === 'red' && "bg-red-900/20 border-2 border-red-600",
                  item.color === 'blue' && "bg-blue-900/20 border-2 border-blue-600",
                  item.color === 'emerald' && "bg-emerald-900/20 border-2 border-emerald-600",
                  item.color === 'purple' && "bg-purple-900/20 border-2 border-purple-600",
                  item.color === 'zinc' && "bg-zinc-900/20 border-2 border-zinc-600"
                )}>
                  <item.icon className={cn(
                    "w-5 h-5",
                    item.color === 'red' && "text-red-500",
                    item.color === 'blue' && "text-blue-500",
                    item.color === 'emerald' && "text-emerald-500",
                    item.color === 'purple' && "text-purple-500",
                    item.color === 'zinc' && "text-zinc-500"
                  )} />
                </div>
                <div className="flex-1 pb-6">
                  <div className="flex items-center gap-3 mb-1 flex-wrap">
                    <h4 className="text-white font-bold group-hover:text-red-400 transition-colors">{item.title}</h4>
                    <span className="px-2 py-0.5 bg-white/5 rounded-full text-xs text-zinc-500 font-mono">{item.date}</span>
                  </div>
                  <p className="text-sm text-zinc-500 leading-relaxed">{item.desc}</p>
                </div>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                  <ArrowRight className="w-5 h-5 text-zinc-600" />
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Phases/Levels - Now Clickable */}
        <div className="bg-black/20 border border-white/5 rounded-3xl p-8 backdrop-blur-sm">
          <h3 className="text-lg font-bold text-white mb-6">Sistema de Progressão</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {levels.map((phase, i) => (
              <button
                key={i}
                onClick={() => phase.status !== 'locked' ? setSelectedLevel(i) : null}
                disabled={phase.status === 'locked'}
                className={cn(
                  "border rounded-2xl p-6 text-center transition-all",
                  phase.status === 'completed' ? "bg-emerald-900/10 border-emerald-600/30 hover:bg-emerald-900/20 cursor-pointer" :
                  phase.status === 'current' ? "bg-red-900/20 border-red-600/50 shadow-[0_0_20px_rgba(185,28,28,0.2)] hover:bg-red-900/30 cursor-pointer" :
                  "bg-black/20 border-white/5 opacity-50 cursor-not-allowed"
                )}
              >
                <div className="text-4xl mb-3">{phase.icon}</div>
                <h4 className={cn(
                  "font-bold mb-1",
                  phase.status === 'current' ? "text-red-400" : "text-white"
                )}>{phase.level}</h4>
                <p className="text-xs text-zinc-500">{phase.desc}</p>
                {phase.status === 'current' && (
                  <div className="mt-3 px-2 py-1 bg-red-600 rounded-full text-xs font-bold uppercase tracking-wider">
                    Ativo
                  </div>
                )}
                {phase.status === 'completed' && (
                  <div className="mt-3">
                    <Check className="w-4 h-4 text-emerald-500 mx-auto" />
                  </div>
                )}
                {phase.status === 'locked' && (
                  <div className="mt-3">
                    <Lock className="w-4 h-4 text-zinc-600 mx-auto" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Modals */}
        <AnimatePresence>
          {journeyModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setJourneyModal(null)}
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="bg-zinc-950 border border-white/10 rounded-3xl p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-1">
                      {journeyModal === 'streak' && 'Histórico de Sequência'}
                      {journeyModal === 'challenges' && 'Histórico de Desafios'}
                      {journeyModal === 'content' && 'Conteúdo Consumido'}
                      {journeyModal === 'level' && 'Detalhes do Nível'}
                      {journeyModal === 'insights' && 'Insights Comportamentais'}
                    </h2>
                    <p className="text-zinc-500 text-sm">
                      {journeyModal === 'streak' && 'Análise detalhada da sua consistência'}
                      {journeyModal === 'challenges' && 'Todos os desafios completados e ativos'}
                      {journeyModal === 'content' && 'Cursos e livros da Biblioteca Estratégica'}
                      {journeyModal === 'level' && 'Progressão e requisitos do sistema'}
                      {journeyModal === 'insights' && 'Padrões identificados no seu comportamento'}
                    </p>
                  </div>
                  <button
                    onClick={() => setJourneyModal(null)}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors flex-shrink-0"
                  >
                    <X className="w-5 h-5 text-zinc-400" />
                  </button>
                </div>

                {journeyModal === 'streak' && (
                  <div className="space-y-4">
                    <div className="bg-black/40 border border-red-900/30 rounded-2xl p-6">
                      <div className="flex items-center gap-4 mb-4">
                        <Flame className="w-12 h-12 text-red-500" />
                        <div>
                          <p className="text-3xl font-bold text-white">23 dias</p>
                          <p className="text-sm text-zinc-500">Sequência atual</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-7 gap-2 mb-4">
                        {Array.from({ length: 28 }).map((_, i) => (
                          <div
                            key={i}
                            className={cn(
                              "aspect-square rounded-lg",
                              i < 23 ? "bg-red-600" : "bg-white/5"
                            )}
                          />
                        ))}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <h4 className="text-sm font-bold text-zinc-400 uppercase tracking-wider">Estatísticas</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white/5 rounded-xl p-4">
                          <p className="text-2xl font-bold text-white">47</p>
                          <p className="text-xs text-zinc-500">Maior sequência</p>
                        </div>
                        <div className="bg-white/5 rounded-xl p-4">
                          <p className="text-2xl font-bold text-white">89%</p>
                          <p className="text-xs text-zinc-500">Taxa de conclusão</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {journeyModal === 'challenges' && (
                  <div className="space-y-4">
                    <div className="space-y-3">
                      {[
                        { name: 'Leitura Diária (21d)', status: 'completed', progress: '21/21', color: 'emerald' },
                        { name: 'Exercício Físico (14d)', status: 'active', progress: '9/14', color: 'blue' },
                        { name: 'Detox Digital (3d)', status: 'completed', progress: '3/3', color: 'emerald' },
                        { name: 'Jejum de Dopamina (7d)', status: 'active', progress: '4/7', color: 'blue' },
                        { name: 'Hidratação 3L (14d)', status: 'active', progress: '6/14', color: 'blue' }
                      ].map((ch, i) => (
                        <div key={i} className="bg-white/5 rounded-xl p-4">
                          <div className="flex justify-between items-center mb-2">
                            <h4 className="font-bold text-white">{ch.name}</h4>
                            <span className={cn(
                              "px-2 py-1 rounded-full text-xs font-bold",
                              ch.status === 'completed' ? "bg-emerald-900/20 text-emerald-400" : "bg-blue-900/20 text-blue-400"
                            )}>
                              {ch.status === 'completed' ? 'Concluído' : 'Ativo'}
                            </span>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
                              <div 
                                className={cn(
                                  "h-full rounded-full",
                                  ch.color === 'emerald' ? "bg-emerald-600" : "bg-blue-600"
                                )}
                                style={{ width: `${(parseInt(ch.progress.split('/')[0]) / parseInt(ch.progress.split('/')[1])) * 100}%` }}
                              />
                            </div>
                            <span className="text-xs text-zinc-500 font-mono">{ch.progress}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {journeyModal === 'content' && (
                  <div className="space-y-4">
                    <div className="bg-black/40 border border-blue-900/30 rounded-2xl p-6 mb-4">
                      <div className="flex items-center gap-4">
                        <BookOpen className="w-12 h-12 text-blue-500" />
                        <div>
                          <p className="text-3xl font-bold text-white">47h</p>
                          <p className="text-sm text-zinc-500">Total consumido</p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <h4 className="text-sm font-bold text-zinc-400 uppercase tracking-wider">Cursos</h4>
                      {[
                        { title: 'Protocolo Dopamina Reset', duration: '8h', progress: 100 },
                        { title: 'Sistema Anti-Procrastinação', duration: '6h', progress: 100 },
                        { title: 'Deep Work Avançado', duration: '12h', progress: 60 }
                      ].map((c, i) => (
                        <div key={i} className="bg-white/5 rounded-xl p-4">
                          <div className="flex justify-between items-center mb-2">
                            <h5 className="font-bold text-white text-sm">{c.title}</h5>
                            <span className="text-xs text-zinc-500">{c.duration}</span>
                          </div>
                          <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-600 rounded-full" style={{ width: `${c.progress}%` }} />
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="space-y-2 mt-4">
                      <h4 className="text-sm font-bold text-zinc-400 uppercase tracking-wider">Livros</h4>
                      {[
                        { title: 'Atomic Habits', author: 'James Clear', progress: 100 },
                        { title: 'Deep Work', author: 'Cal Newport', progress: 50 },
                        { title: 'The War of Art', author: 'Steven Pressfield', progress: 30 }
                      ].map((b, i) => (
                        <div key={i} className="bg-white/5 rounded-xl p-4">
                          <h5 className="font-bold text-white text-sm">{b.title}</h5>
                          <p className="text-xs text-zinc-500 mb-2">{b.author}</p>
                          <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                            <div className="h-full bg-purple-600 rounded-full" style={{ width: `${b.progress}%` }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {journeyModal === 'level' && (
                  <div className="space-y-4">
                    <div className="bg-gradient-to-br from-red-900/20 to-purple-900/20 border border-red-600/50 rounded-2xl p-6">
                      <div className="text-center">
                        <div className="text-6xl mb-4">🟠</div>
                        <h3 className="text-2xl font-bold text-white mb-1">Operador</h3>
                        <p className="text-sm text-zinc-400">Nível 2 de 5</p>
                        <div className="mt-4 h-2 bg-white/5 rounded-full overflow-hidden">
                          <div className="h-full bg-red-600 rounded-full" style={{ width: '45%' }} />
                        </div>
                        <p className="text-xs text-zinc-500 mt-2">45% para próximo nível</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <h4 className="text-sm font-bold text-zinc-400 uppercase tracking-wider">Requisitos Cumpridos</h4>
                      {[
                        '10+ dias de consistência',
                        '3+ desafios ativos',
                        '5+ compromissos de ação'
                      ].map((req, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm">
                          <Check className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                          <span className="text-zinc-300">{req}</span>
                        </div>
                      ))}
                    </div>
                    <div className="space-y-2">
                      <h4 className="text-sm font-bold text-zinc-400 uppercase tracking-wider">Recompensas Desbloqueadas</h4>
                      {[
                        'Co-working Virtual',
                        'Análise com IA no Diário',
                        'Protocolo Anti-Queda'
                      ].map((reward, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm">
                          <Zap className="w-4 h-4 text-purple-500 flex-shrink-0" />
                          <span className="text-zinc-300">{reward}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {journeyModal === 'insights' && (
                  <div className="space-y-4">
                    <div className="bg-gradient-to-br from-red-900/10 to-purple-900/10 border border-red-900/30 rounded-2xl p-6">
                      <h4 className="font-bold text-white mb-3 flex items-center gap-2">
                        <Brain className="w-5 h-5 text-red-500" />
                        Padrões Identificados
                      </h4>
                      <ul className="space-y-2 text-sm text-zinc-300">
                        <li className="flex gap-2">
                          <span className="text-red-500 flex-shrink-0">•</span>
                          <span>Maior produtividade entre 9h-12h (pico de energia)</span>
                        </li>
                        <li className="flex gap-2">
                          <span className="text-red-500 flex-shrink-0">•</span>
                          <span>Queda de foco típica às 16h (implementado protocolo)</span>
                        </li>
                        <li className="flex gap-2">
                          <span className="text-red-500 flex-shrink-0">•</span>
                          <span>Taxa de conclusão de RED: 89% (acima da média)</span>
                        </li>
                      </ul>
                    </div>
                    <div className="bg-black/40 border border-white/10 rounded-2xl p-6">
                      <h4 className="font-bold text-white mb-3 flex items-center gap-2">
                        <Target className="w-5 h-5 text-emerald-500" />
                        Áreas de Destaque
                      </h4>
                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm text-zinc-300">Consistência</span>
                            <span className="text-sm font-bold text-emerald-400">Excelente</span>
                          </div>
                          <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                            <div className="h-full bg-emerald-600 rounded-full" style={{ width: '92%' }} />
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm text-zinc-300">Execução</span>
                            <span className="text-sm font-bold text-blue-400">Muito Bom</span>
                          </div>
                          <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-600 rounded-full" style={{ width: '78%' }} />
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm text-zinc-300">Aprendizado</span>
                            <span className="text-sm font-bold text-purple-400">Bom</span>
                          </div>
                          <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                            <div className="h-full bg-purple-600 rounded-full" style={{ width: '65%' }} />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="bg-amber-900/10 border border-amber-600/30 rounded-2xl p-6">
                      <h4 className="font-bold text-white mb-3 flex items-center gap-2">
                        <Zap className="w-5 h-5 text-amber-500" />
                        Recomendações
                      </h4>
                      <ul className="space-y-2 text-sm text-zinc-300">
                        <li className="flex gap-2">
                          <span className="text-amber-500 flex-shrink-0">→</span>
                          <span>Manter protocolo vespertino ativo (resultados positivos)</span>
                        </li>
                        <li className="flex gap-2">
                          <span className="text-amber-500 flex-shrink-0">→</span>
                          <span>Aumentar tempo de Deep Work para 120min (capacidade detectada)</span>
                        </li>
                        <li className="flex gap-2">
                          <span className="text-amber-500 flex-shrink-0">→</span>
                          <span>Ativar desafio "Sono Otimizado" para melhorar recuperação</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                )}
              </motion.div>
            </motion.div>
          )}

          {selectedTimelineItem !== null && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setSelectedTimelineItem(null)}
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="bg-zinc-950 border border-white/10 rounded-3xl p-8 max-w-lg w-full"
                onClick={(e) => e.stopPropagation()}
              >
                {(() => {
                  const item = timelineItems[selectedTimelineItem];
                  return (
                    <>
                      <div className="flex justify-between items-start mb-6">
                        <div className="flex items-center gap-4 flex-1">
                          <div className={cn(
                            "w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0",
                            item.color === 'red' && "bg-red-900/20 border-2 border-red-600",
                            item.color === 'blue' && "bg-blue-900/20 border-2 border-blue-600",
                            item.color === 'emerald' && "bg-emerald-900/20 border-2 border-emerald-600",
                            item.color === 'purple' && "bg-purple-900/20 border-2 border-purple-600",
                            item.color === 'zinc' && "bg-zinc-900/20 border-2 border-zinc-600"
                          )}>
                            <item.icon className={cn(
                              "w-8 h-8",
                              item.color === 'red' && "text-red-500",
                              item.color === 'blue' && "text-blue-500",
                              item.color === 'emerald' && "text-emerald-500",
                              item.color === 'purple' && "text-purple-500",
                              item.color === 'zinc' && "text-zinc-500"
                            )} />
                          </div>
                          <div className="min-w-0">
                            <span className="px-2 py-1 bg-white/5 rounded-full text-xs text-zinc-500 font-mono">{item.date}</span>
                            <h3 className="text-xl font-bold text-white mt-2 break-words">{item.title}</h3>
                          </div>
                        </div>
                        <button
                          onClick={() => setSelectedTimelineItem(null)}
                          className="p-2 hover:bg-white/10 rounded-lg transition-colors flex-shrink-0 ml-2"
                        >
                          <X className="w-5 h-5 text-zinc-400" />
                        </button>
                      </div>
                      <div className="bg-black/40 border border-white/10 rounded-2xl p-6">
                        <p className="text-zinc-300 leading-relaxed">{item.details}</p>
                      </div>
                    </>
                  );
                })()}
              </motion.div>
            </motion.div>
          )}

          {selectedLevel !== null && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setSelectedLevel(null)}
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="bg-zinc-950 border border-white/10 rounded-3xl p-8 max-w-lg w-full"
                onClick={(e) => e.stopPropagation()}
              >
                {(() => {
                  const lvl = levels[selectedLevel];
                  return (
                    <>
                      <div className="flex justify-between items-start mb-6">
                        <div className="text-center flex-1">
                          <div className="text-6xl mb-4">{lvl.icon}</div>
                          <h3 className="text-2xl font-bold text-white mb-1">{lvl.level}</h3>
                          <p className="text-sm text-zinc-500">{lvl.desc}</p>
                        </div>
                        <button
                          onClick={() => setSelectedLevel(null)}
                          className="p-2 hover:bg-white/10 rounded-lg transition-colors flex-shrink-0"
                        >
                          <X className="w-5 h-5 text-zinc-400" />
                        </button>
                      </div>
                      <div className="space-y-4">
                        <div className="bg-black/40 border border-white/10 rounded-2xl p-6">
                          <h4 className="text-sm font-bold text-zinc-400 uppercase tracking-wider mb-3">Requisitos</h4>
                          <ul className="space-y-2">
                            {lvl.requirements.map((req, i) => (
                              <li key={i} className="flex items-center gap-2 text-sm text-zinc-300">
                                {lvl.status === 'completed' ? (
                                  <Check className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                                ) : (
                                  <div className="w-4 h-4 rounded border border-zinc-700 flex-shrink-0" />
                                )}
                                <span>{req}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="bg-black/40 border border-white/10 rounded-2xl p-6">
                          <h4 className="text-sm font-bold text-zinc-400 uppercase tracking-wider mb-3">Recompensas</h4>
                          <ul className="space-y-2">
                            {lvl.rewards.map((reward, i) => (
                              <li key={i} className="flex items-center gap-2 text-sm text-zinc-300">
                                <Zap className="w-4 h-4 text-purple-500 flex-shrink-0" />
                                <span>{reward}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </>
                  );
                })()}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
