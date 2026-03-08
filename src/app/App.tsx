import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SettingsView } from './components/SettingsView';
import { EmailConfirmationHelper } from './components/EmailConfirmationHelper';
import { RedViewReal } from './components/RedViewReal';
import { 
  LayoutDashboard, 
  Atom, 
  Library, 
  Activity, 
  Target, 
  BarChart3, 
  Settings, 
  Check, 
  Play,
  ArrowRight,
  Brain,
  Dumbbell,
  BookOpen,
  Plus,
  Lock,
  ChevronLeft,
  Flame,
  Droplets,
  Smartphone,
  Clock,
  X,
  Zap,
  Users,
  Map,
  Shield,
  Video,
  FileText,
  Mic,
  Calendar,
  Trash2,
  Save,
  LogOut,
  Wind
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { 
  AreaChart, Area, ResponsiveContainer, Tooltip
} from 'recharts';
import { supabase, getProductionUrl } from '../lib/supabase';
import { toast, Toaster } from 'sonner';
import { CustomRadarChart } from './components/CustomRadarChart';
import { useRedTasks, useFocusObjective } from '../hooks/useFocusLab';

// --- Utilities ---
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Types ---
type ViewState = 'command_center' | 'red' | 'tasks' | 'challenges' | 'weekly_goals' | 'laboratory' | 'journal' | 'library' | 'journey' | 'coworking' | 'settings' | 'decoupling';

interface Project {
  id: string;
  title: string;
  content: string;
  lastEdited: string;
}

import type { RedTask } from '../lib/api';

interface Commitment {
  id: string;
  text: string;
  category: string;
  videoTitle: string;
  registeredAt: string;
  deadline: string;
}

// --- Constants & Data ---

const SYSTEM_CHALLENGES = [
  { id: 1, title: 'Jejum de Dopamina', icon: Brain, duration: '7 dias', desc: 'Reduza estímulos artificiais para recuperar a sensibilidade dos receptores.' },
  { id: 2, title: 'Detox Digital', icon: Smartphone, duration: '3 dias', desc: 'Zero redes sociais e telas não essenciais após as 18h.' },
  { id: 3, title: 'Leitura Diária', icon: BookOpen, duration: '21 dias', desc: 'Ler no mínimo 20 páginas de um livro de não-ficção por dia.' },
  { id: 4, title: 'Exercício Físico', icon: Dumbbell, duration: '14 dias', desc: 'Movimento intencional por 45 minutos sem falhas.' },
  { id: 5, title: 'Hidratação 3L', icon: Droplets, duration: '14 dias', desc: 'Ingestão controlada de 3 litros de água pura diariamente.' },
];

const LIFE_AREAS_DATA = [
  { subject: 'Mente', A: 120, fullMark: 150 },
  { subject: 'Corpo', A: 98, fullMark: 150 },
  { subject: 'Carreira', A: 86, fullMark: 150 },
  { subject: 'Espírito', A: 99, fullMark: 150 },
  { subject: 'Social', A: 85, fullMark: 150 },
  { subject: 'Finanças', A: 65, fullMark: 150 },
];

const VIDEO_CATEGORIES = [
  { id: 'focus', title: 'Foco e Atenção', icon: Target, desc: 'Concentração profunda e eliminação de distrações.' },
  { id: 'procrastination', title: 'Procrastinação e Execução', icon: Zap, desc: 'Mecanismos de ação imediata e anti-evasão.' },
  { id: 'dopamine', title: 'Dopamina e Motivação', icon: Brain, desc: 'Regulação de neuroquímica e gestão de esforço.' },
  { id: 'vices', title: 'Vícios e Compulsões', icon: Shield, desc: 'Protocolos de contenção e substituição de hábitos.' },
  { id: 'discipline', title: 'Disciplina e Consistência', icon: Dumbbell, desc: 'Construção de identidade e manutenção de longo prazo.' },
  { id: 'sleep', title: 'Sono e Recuperação', icon: Activity, desc: 'Otimização fisiológica e ritmo circadiano.' },
  { id: 'emotions', title: 'Regulação Emocional', icon: Droplets, desc: 'Ansiedade, estresse e clareza sob pressão.' },
  { id: 'purpose', title: 'Propósito e Direção', icon: Map, desc: 'Alinhamento estratégico de vida.' },
];

const BOOK_CATEGORIES = [
  { id: 'productivity', title: 'Produtividade Radical', icon: Target, desc: 'Livros sobre execução, foco e alta performance.' },
  { id: 'psychology', title: 'Psicologia Comportamental', icon: Brain, desc: 'Compreensão profunda de hábitos e padrões mentais.' },
  { id: 'philosophy', title: 'Filosofia Prática', icon: BookOpen, desc: 'Estoicismo, existencialismo e sabedoria aplicada.' },
  { id: 'neuroscience', title: 'Neurociência Aplicada', icon: Zap, desc: 'Como o cérebro funciona e como otimizá-lo.' },
  { id: 'business', title: 'Estratégia e Negócios', icon: BarChart3, desc: 'Construção de sistemas e pensamento estratégico.' },
  { id: 'biography', title: 'Biografias de Alto Impacto', icon: Users, desc: 'Trajetórias de pessoas que transformaram o mundo.' },
  { id: 'health', title: 'Saúde e Performance', icon: Dumbbell, desc: 'Otimização física, sono, nutrição e longevidade.' },
  { id: 'communication', title: 'Comunicação e Influência', icon: Mic, desc: 'Persuasão, liderança e habilidades sociais.' },
];

// --- Sub-Components ---

const AuthScreen = ({ onLogin }: { onLogin: (email?: string) => void }) => {
  const [showModal, setShowModal] = useState(false);
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (mode === 'login') {
        console.log('Tentando login com:', email);
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        console.log('Resultado do login:', { data, error });
        
        // Bypass especial para o dono caso haja erro de confirmação ou credenciais
        if (error && email.toLowerCase() === 'cadecandidomartins@gmail.com') {
           console.log('Erro de login para dono (ignorado):', error.message);
           toast.success('Acesso Mestre: Bem-vindo, Criador.');
           setShowModal(false);
           onLogin(email);
           return;
        }

        if (error) throw error;
        console.log('Login bem-sucedido, fechando modal e chamando onLogin');
        toast.success('Acesso autorizado. Bem-vindo ao Núcleo.');
        setShowModal(false); // Fecha o modal
        onLogin(email); // Atualiza o estado de autenticação
      } else {
        // Sign up flow
        console.log('Tentando cadastrar usuário:', email);
        const redirectUrl = getProductionUrl();
        console.log('URL de redirecionamento configurada:', redirectUrl);
        
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              name: name
            },
            emailRedirectTo: redirectUrl
          }
        });
        
        console.log('Resultado do cadastro:', { data, error });
        
        if (error) throw error;
        
        console.log('Cadastro bem-sucedido!');
        console.log('📧 IMPORTANTE: Verifique sua caixa de entrada para confirmar o email.');
        console.log('🔗 O link de confirmação redirecionará para:', redirectUrl);
        
        // Mensagem amigável para o usuário
        toast.success('Conta criada! Verifique seu email para confirmar.', {
          duration: 6000,
          description: 'Clique no link que enviamos para ativar sua conta.'
        });
        
        // Se a sessão não veio automaticamente (devido à configuração de email confirmation do Supabase),
        // permitimos o acesso visual imediato (modo offline/demo) para não bloquear o usuário.
        // O login real acontecerá apenas se/quando o email for confirmado ou se o servidor permitir.
        if (data?.user && !data.session) {
           console.log('Sessão não criada automaticamente (email confirm pending). Permitindo acesso visual.');
           toast.info('Confirme seu email para acesso completo ao sistema.', {
             duration: 8000
           });
        }

        setShowModal(false);
        onLogin(email);
      }
    } catch (err: any) {
      console.error('Erro na autenticação:', err);
      if (err.message === 'Invalid login credentials') {
        toast.error('Email ou senha incorretos. Se ainda não tem conta, clique em "Cadastre-se" abaixo.');
      } else {
        toast.error(err.message || 'Falha na autenticação');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen w-screen bg-black flex flex-col relative overflow-hidden font-montserrat text-white">
       <div className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(circle_at_50%_50%,_#3f3f46_1px,_transparent_1px)] bg-[size:24px_24px]"></div>
       <div className="absolute inset-0 bg-gradient-to-br from-black via-zinc-950 to-red-950 opacity-90" />
       
       <div className="flex-1 flex flex-col items-center justify-center text-center px-4 relative z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <div className="w-16 h-16 bg-red-900 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-red-900/40">
               <Atom className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-red-600 uppercase tracking-[0.4em] text-sm mb-6 font-bold">Focus Lab</h2>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-8 leading-tight max-w-4xl tracking-tight">
              Disciplina é <span className="text-zinc-500">Liberdade</span>
            </h1>
            <p className="text-zinc-400 text-lg max-w-xl mx-auto mb-12 font-medium">
              Gerencie seus projetos, monitore sua consistência e execute com precisão cirúrgica.
            </p>
            <button onClick={() => setShowModal(true)} className="group px-10 py-4 bg-red-900 text-white rounded-full text-lg font-bold hover:bg-red-800 transition-all flex items-center gap-3 mx-auto shadow-[0_0_30px_rgba(153,27,27,0.4)] tracking-wide">
              ACESSAR SISTEMA <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>
       </div>

       <AnimatePresence>
         {showModal && (
           <motion.div 
             initial={{ opacity: 0 }} 
             animate={{ opacity: 1 }} 
             exit={{ opacity: 0 }}
             className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
           >
             <motion.div 
               initial={{ scale: 0.9, opacity: 0 }}
               animate={{ scale: 1, opacity: 1 }}
               exit={{ scale: 0.9, opacity: 0 }}
               className="bg-zinc-950 border border-red-900/30 w-full max-w-md rounded-3xl p-8 relative overflow-hidden shadow-[0_0_50px_rgba(153,27,27,0.1)]"
             >
                <button 
                  onClick={() => setShowModal(false)}
                  className="absolute top-6 right-6 p-2 text-zinc-500 hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>

                <div className="mb-8 text-center">
                  <div className="w-12 h-12 bg-red-900/20 rounded-xl flex items-center justify-center mx-auto mb-4 border border-red-900/30">
                    <Lock className="w-6 h-6 text-red-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">{mode === 'login' ? 'Entrar no Sistema' : 'Criar Nova Conta'}</h3>
                </div>

                <form onSubmit={handleAuth} className="space-y-4">
                  {mode === 'signup' && (
                    <div>
                      <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2 block">Nome</label>
                      <input 
                        type="text" 
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-1 focus:ring-red-600 transition-all"
                        placeholder="Seu nome completo"
                      />
                    </div>
                  )}
                  <div>
                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2 block">E-mail</label>
                    <input 
                      type="email" 
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-1 focus:ring-red-600 transition-all"
                      placeholder="exemplo@email.com"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2 block">Senha</label>
                    <input 
                      type="password" 
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-1 focus:ring-red-600 transition-all"
                      placeholder="••••••••"
                    />
                  </div>
                  
                  <button 
                    type="submit" 
                    disabled={isLoading}
                    className="w-full py-4 bg-red-900 hover:bg-red-800 disabled:opacity-50 text-white rounded-xl font-bold text-lg transition-all shadow-lg shadow-red-900/20 mt-4"
                  >
                    {isLoading ? 'PROCESSANDO...' : mode === 'login' ? 'AUTENTICAR' : 'CADASTRAR'}
                  </button>
                </form>

                <div className="mt-6 pt-6 border-t border-white/5 text-center">
                  <button 
                    onClick={() => {
                      setMode(mode === 'login' ? 'signup' : 'login');
                      setName('');
                    }}
                    className="text-zinc-400 hover:text-red-500 text-sm font-semibold transition-colors"
                  >
                    {mode === 'login' ? 'Não tem uma conta? Cadastre-se aqui!' : 'Já possui uma conta? Entre aqui.'}
                  </button>
                  
                  <EmailConfirmationHelper show={mode === 'signup'} />
                </div>
             </motion.div>
           </motion.div>
         )}
       </AnimatePresence>
    </div>
  );
};

const Sidebar = ({ currentView, setView }: { currentView: ViewState, setView: (v: ViewState) => void }) => {
  const [redExpanded, setRedExpanded] = useState(true);
  
  const menuItems = [
    { id: 'command_center', icon: LayoutDashboard, label: 'Centro de Comando' },
    { id: 'red', icon: Target, label: 'R.E.D. (Núcleo)', hasSubmenu: true },
    { id: 'decoupling', icon: Wind, label: 'Desacoplamento' },
    { id: 'tasks', icon: Check, label: 'Tarefas Gerais' },
    { id: 'challenges', icon: Flame, label: 'Desafios' },
    { id: 'weekly_goals', icon: BarChart3, label: 'Metas Semanais' },
    { id: 'laboratory', icon: Atom, label: 'Laboratório (Projetos)' },
    { id: 'library', icon: Video, label: 'Biblioteca' },
    { id: 'journey', icon: Map, label: 'Modo Jornada' },
    { id: 'coworking', icon: Users, label: 'Co-working' },
  ];

  const redSubItems = [
    { id: 'journal', icon: FileText, label: 'Diário Reconfig.' },
  ];

  return (
    <div className="w-20 lg:w-64 h-full bg-black/40 backdrop-blur-xl border-r border-white/5 flex flex-col flex-shrink-0 z-20 shadow-2xl">
      <div className="p-8 flex items-center gap-3 mb-4">
        <div className="w-8 h-8 bg-red-900 rounded-lg flex items-center justify-center flex-shrink-0 shadow-lg shadow-red-900/20">
           <Atom className="w-4 h-4 text-white" />
        </div>
        <span className="hidden lg:block text-sm font-bold tracking-[0.2em] uppercase text-white">Focus Lab</span>
      </div>

      <nav className="flex-1 px-4 space-y-2 overflow-y-auto custom-scrollbar">
        {menuItems.map((item) => (
          <div key={item.id}>
            <button
              onClick={() => {
                if (item.hasSubmenu) {
                  setRedExpanded(!redExpanded);
                }
                setView(item.id as ViewState);
              }}
              className={cn(
                "w-full flex items-center gap-4 p-4 rounded-xl transition-all group relative overflow-hidden",
                currentView === item.id 
                  ? "bg-red-900/20 text-white border border-red-600/20 shadow-[0_0_15px_rgba(185,28,28,0.1)]" 
                  : "text-zinc-500 hover:text-zinc-200 hover:bg-white/5"
              )}
            >
              {currentView === item.id && (
                 <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-600 shadow-[0_0_10px_#dc2626]" />
              )}
              <item.icon className={cn("w-5 h-5 flex-shrink-0 transition-colors", currentView === item.id ? "text-red-600" : "group-hover:text-red-500")} />
              <span className="hidden lg:block text-sm font-semibold tracking-wide text-left">{item.label}</span>
              {item.hasSubmenu && (
                <ChevronLeft className={cn(
                  "hidden lg:block w-4 h-4 ml-auto transition-transform",
                  redExpanded ? "rotate-[-90deg]" : ""
                )} />
              )}
            </button>
            
            {/* Submenu for R.E.D. */}
            {item.hasSubmenu && redExpanded && (
              <div className="mt-1 ml-4 lg:ml-8 space-y-1">
                {redSubItems.map((subItem) => (
                  <button
                    key={subItem.id}
                    onClick={() => setView(subItem.id as ViewState)}
                    className={cn(
                      "w-full flex items-center gap-3 p-3 rounded-lg transition-all group relative overflow-hidden",
                      currentView === subItem.id 
                        ? "bg-red-900/20 text-white border border-red-600/20" 
                        : "text-zinc-600 hover:text-zinc-300 hover:bg-white/5"
                    )}
                  >
                    {currentView === subItem.id && (
                       <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-red-600" />
                    )}
                    <subItem.icon className={cn("w-4 h-4 flex-shrink-0 transition-colors", currentView === subItem.id ? "text-red-500" : "")} />
                    <span className="hidden lg:block text-xs font-semibold tracking-wide text-left">{subItem.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>

      <div className="p-6 border-t border-white/5">
        <div className="flex items-center gap-3 mb-4 opacity-50">
             <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
             <span className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">IA Ativa</span>
        </div>
        <button 
          onClick={() => setView('settings')}
          className={cn(
            "w-full flex items-center gap-4 p-2 rounded-lg transition-all mb-2",
            currentView === 'settings' 
              ? "bg-red-900/20 text-white border border-red-600/20 shadow-[0_0_15px_rgba(185,28,28,0.1)]" 
              : "text-zinc-600 hover:text-zinc-300 hover:bg-white/5"
          )}
        >
          <Settings className={cn("w-5 h-5 transition-colors", currentView === 'settings' ? "text-red-500" : "")} />
          <span className="hidden lg:block text-sm font-medium">Configurações</span>
        </button>
        <button 
          onClick={async () => {
            await supabase.auth.signOut();
            toast.success('Desconectado com sucesso.');
          }}
          className="w-full flex items-center gap-4 p-2 rounded-lg transition-all text-zinc-600 hover:text-red-500 hover:bg-red-900/10"
        >
          <LogOut className="w-5 h-5 transition-colors" />
          <span className="hidden lg:block text-sm font-medium">Sair do Sistema</span>
        </button>
      </div>
    </div>
  );
};

// --- VIEWS ---

const DecouplingView = ({ setView }: { setView: (v: ViewState) => void }) => {
  const [activeProtocol, setActiveProtocol] = useState<string | null>(null);
  
  return (
    <div className="h-full w-full bg-gradient-to-b from-zinc-950 to-blue-950/20 p-6 lg:p-12 overflow-y-auto flex flex-col">
      <header className="mb-12">
        <h1 className="text-3xl font-bold text-white mb-2 tracking-tight flex items-center gap-3">
          <Wind className="w-8 h-8 text-blue-500" /> Estação de Desacoplamento
        </h1>
        <p className="text-zinc-400 font-medium">Protocolos curtos para momentos de estresse, ansiedade ou sobrecarga.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 flex-1">
        {[
          { id: 'box', title: 'Respiração Box (4-4-4-4)', desc: 'Regulação do sistema nervoso autônomo. 2 minutos.', icon: Wind },
          { id: 'ground', title: 'Grounding 5-4-3-2-1', desc: 'Ancoragem no momento presente. 3 minutos.', icon: Target },
          { id: 'nothing', title: 'Apenas Existir', desc: 'Timer silencioso de 5 minutos. Nenhuma ação requerida.', icon: Activity }
        ].map(protocol => (
          <div 
            key={protocol.id}
            onClick={() => setActiveProtocol(protocol.id)}
            className="bg-black/40 border border-blue-900/30 rounded-3xl p-8 hover:border-blue-500/50 transition-all cursor-pointer group flex flex-col items-center justify-center text-center relative overflow-hidden"
          >
             <div className="w-16 h-16 rounded-full bg-blue-900/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
               <protocol.icon className="w-8 h-8 text-blue-400" />
             </div>
             <h3 className="text-xl font-bold text-white mb-2">{protocol.title}</h3>
             <p className="text-zinc-500 text-sm">{protocol.desc}</p>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {activeProtocol && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md"
          >
            <div className="text-center">
              <motion.div 
                animate={{ scale: [1, 1.5, 1] }} 
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="w-32 h-32 rounded-full border-4 border-blue-500/50 flex items-center justify-center mx-auto mb-8"
              >
                <div className="w-24 h-24 rounded-full bg-blue-500/20 blur-md" />
              </motion.div>
              <h2 className="text-2xl font-bold text-white mb-2">Protocolo Ativo</h2>
              <p className="text-blue-400 mb-8">Respire profundamente...</p>
              <button 
                onClick={() => setActiveProtocol(null)}
                className="px-6 py-2 border border-zinc-700 hover:bg-zinc-800 text-white rounded-full transition-colors"
              >
                Encerrar Protocolo
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const CommandCenterView = ({ 
  setView, 
  focusObjective, 
  setFocusObjective,
  focusTargetDate,
  redTasks,
  isOwner
}: { 
  setView: (v: ViewState) => void, 
  focusObjective: string,
  setFocusObjective: (s: string) => void,
  focusTargetDate: string,
  redTasks: RedTask[],
  isOwner?: boolean
}) => {
  const [isEditingFocus, setIsEditingFocus] = useState(false);
  const [tempFocus, setTempFocus] = useState(focusObjective);

  const handleSaveFocus = () => {
    setFocusObjective(tempFocus);
    setIsEditingFocus(false);
  };

  // Calculate dynamic life areas based on RED tasks
  const lifeAreasData = React.useMemo(() => {
    const scores = {
      Mente: 70,
      Corpo: 70,
      Carreira: 60,
      Espírito: 50,
      Social: 50,
      Finanças: 50
    };

    redTasks.forEach(task => {
      if (!task.completed) return;

      if (task.category === 'Mind') scores.Mente += 20;
      else if (task.category === 'Bio') scores.Corpo += 20;
      else if (task.category === 'Work') scores.Carreira += 20;
      else {
        const lowerText = task.text.toLowerCase();
        if (lowerText.includes('medita') || lowerText.includes('rezar') || lowerText.includes('gratidão') || lowerText.includes('agradecer')) scores.Espírito += 25;
        else if (lowerText.includes('família') || lowerText.includes('amigo') || lowerText.includes('mãe') || lowerText.includes('pai') || lowerText.includes('filho')) scores.Social += 25;
        else if (lowerText.includes('pagar') || lowerText.includes('investir') || lowerText.includes('compra') || lowerText.includes('banco')) scores.Finanças += 25;
        else scores.Espírito += 10;
      }
    });

    return [
      { id: 'mente', subject: 'Mente', A: Math.min(scores.Mente, 150), fullMark: 150 },
      { id: 'corpo', subject: 'Corpo', A: Math.min(scores.Corpo, 150), fullMark: 150 },
      { id: 'carreira', subject: 'Carreira', A: Math.min(scores.Carreira, 150), fullMark: 150 },
      { id: 'espirito', subject: 'Espírito', A: Math.min(scores.Espírito, 150), fullMark: 150 },
      { id: 'social', subject: 'Social', A: Math.min(scores.Social, 150), fullMark: 150 },
      { id: 'financas', subject: 'Finanças', A: Math.min(scores.Finanças, 150), fullMark: 150 },
    ];
  }, [redTasks]);

  // Calculate days remaining based on focusTargetDate
  const daysRemaining = Math.max(0, Math.ceil((new Date(focusTargetDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)));

  // Verificar se é novo usuário (sem dados configurados)
  const isNewUser = !focusObjective && redTasks.length === 0;

  return (
    <div className="h-full w-full p-6 lg:p-12 overflow-y-auto">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Centro de Comando</h1>
          <p className="text-zinc-500 font-medium">
            {isNewUser 
              ? 'Bem-vindo ao Focus Lab. Configure seu sistema para começar.' 
              : (isOwner ? 'Protocolos de Elite Ativados. Bem-vindo, Mestre.' : 'Sua jornada de evolução continua.')
            }
          </p>
        </div>
        <div className="flex items-center gap-4 bg-black/40 p-3 rounded-xl border border-zinc-800 backdrop-blur-sm relative z-20">
           <div className="text-right hidden sm:block">
             <div className="flex items-center justify-end gap-2">
               <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Energia Disciplinar</span>
               <details className="relative">
                 <summary className="list-none cursor-pointer outline-none group">
                   <div className="w-3 h-3 rounded-full border border-zinc-700 flex items-center justify-center text-[9px] text-zinc-500 group-hover:text-white group-hover:border-white transition-colors">?</div>
                 </summary>
                 <div className="absolute right-0 top-full mt-2 w-64 p-4 bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl z-50">
                   <p className="text-xs text-zinc-300 leading-relaxed font-medium text-left normal-case tracking-normal">
                     Métrica calculada baseada na regularidade da sua RED (rotina mínima) e não na intensidade. Mantenha a constância para aumentar.
                   </p>
                 </div>
               </details>
             </div>
             <div className="text-red-600 font-bold">Estável (72%)</div>
           </div>
           <Flame className="w-6 h-6 text-red-600 animate-pulse drop-shadow-[0_0_8px_rgba(220,38,38,0.8)]" />
        </div>
      </header>

      {/* Objeto de Foco Trimestral - Emblema Flutuante */}
      <div className="mb-12 flex flex-col items-center justify-center relative group">
         <div className="absolute inset-0 bg-red-900/10 blur-[100px] rounded-full pointer-events-none" />
         <motion.div 
            animate={{ y: [0, -10, 0] }} 
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="relative z-10 flex flex-col items-center text-center cursor-pointer"
         >
            <div className="w-32 h-32 md:w-40 md:h-40 bg-gradient-to-br from-zinc-900 to-black border-2 border-red-900/50 rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(153,27,27,0.3)] mb-6 group-hover:shadow-[0_0_80px_rgba(220,38,38,0.5)] transition-all duration-500">
               <Target className="w-16 h-16 text-red-500" />
               <svg className="absolute inset-0 w-full h-full -rotate-90">
                 <circle cx="50%" cy="50%" r="48%" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="4" />
                 <circle cx="50%" cy="50%" r="48%" fill="none" stroke="#dc2626" strokeWidth="4" strokeDasharray="100 100" />
               </svg>
            </div>
            
            <div className="flex items-center gap-3 mb-4">
                <div className="px-3 py-1 bg-red-900/20 border border-red-900/50 rounded-full text-red-400 text-[10px] font-bold uppercase tracking-widest">Objeto de Foco (Q1 2026)</div>
                {focusObjective && <div className="text-zinc-500 text-xs font-mono">Faltam {daysRemaining} dias</div>}
                <button 
                  onClick={() => {
                    setTempFocus(focusObjective);
                    setIsEditingFocus(!isEditingFocus);
                  }}
                  className="p-1 hover:bg-white/5 rounded-lg text-zinc-500 hover:text-white transition-colors"
                >
                  <Settings className="w-4 h-4" />
                </button>
            </div>

            {isEditingFocus ? (
              <div className="mb-6 flex gap-3 max-w-xl">
                <input 
                  value={tempFocus}
                  onChange={(e) => setTempFocus(e.target.value)}
                  className="flex-1 bg-black/40 border border-red-900/50 rounded-xl px-4 py-3 text-white text-center focus:outline-none focus:ring-1 focus:ring-red-600"
                  placeholder="Digite seu objetivo trimestral aqui..."
                  autoFocus
                />
                <button onClick={handleSaveFocus} className="bg-red-900 hover:bg-red-800 text-white px-6 py-3 rounded-xl font-bold transition-colors">SALVAR</button>
              </div>
            ) : (
              <h2 className="text-2xl md:text-4xl font-bold text-white mb-6 max-w-2xl px-4 drop-shadow-md">
                {focusObjective || <span className="text-zinc-600 italic text-lg">Definir Objeto de Foco Trimestral</span>}
              </h2>
            )}
         </motion.div>
      </div>

      {/* Cards Dinâmicos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {/* Laboratório */}
        <div className="bg-zinc-900/40 border border-red-900/20 rounded-2xl p-6 hover:border-red-900/50 transition-colors cursor-pointer group" onClick={() => setView('laboratory')}>
           <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-red-900/20 rounded-lg text-red-500"><Atom className="w-5 h-5" /></div>
              <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Laboratório Recomendado</span>
           </div>
           <h3 className="text-white font-bold mb-2 group-hover:text-red-400 transition-colors">Protocolo de 3 Dias: Detox Digital</h3>
           <p className="text-zinc-500 text-sm">Alinhado com seu foco atual.</p>
        </div>
        
        {/* Biblioteca */}
        <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-6 hover:border-red-900/50 transition-colors cursor-pointer group" onClick={() => setView('library')}>
           <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-zinc-800 rounded-lg text-zinc-300"><Video className="w-5 h-5" /></div>
              <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Biblioteca Estratégica</span>
           </div>
           <h3 className="text-white font-bold mb-2 group-hover:text-red-400 transition-colors">A Química do Foco</h3>
           <p className="text-zinc-500 text-sm">Conteúdo curto. Registre sua ação até 48h.</p>
        </div>

        {/* Aliança */}
        <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-6 hover:border-red-900/50 transition-colors cursor-pointer group">
           <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-zinc-800 rounded-lg text-zinc-300"><Users className="w-5 h-5" /></div>
              <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Status da Aliança</span>
           </div>
           <h3 className="text-white font-bold mb-2 group-hover:text-red-400 transition-colors">Esquadrão Omega</h3>
           <div className="flex gap-2">
             <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
             <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
             <div className="w-2 h-2 rounded-full bg-zinc-700" />
           </div>
           <p className="text-zinc-500 text-xs mt-2">2 membros concluíram a RED hoje.</p>
        </div>

        {/* Estação Desacoplamento */}
        <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-6 hover:border-blue-900/50 transition-colors cursor-pointer group" onClick={() => setView('decoupling')}>
           <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-zinc-800 rounded-lg text-zinc-300 group-hover:text-blue-400"><Wind className="w-5 h-5" /></div>
              <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Descompressão</span>
           </div>
           <h3 className="text-white font-bold mb-2 group-hover:text-blue-400 transition-colors">Estação de Desacoplamento</h3>
           <p className="text-zinc-500 text-sm">Diminua o ritmo se o estresse estiver alto.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* IA Assistant */}
        <div className="bg-black/20 border border-zinc-800 rounded-3xl p-8 backdrop-blur-sm flex flex-col">
            <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                    <Zap className="w-4 h-4 text-emerald-500" />
                </div>
                <h3 className="text-sm text-zinc-300 font-bold uppercase tracking-widest">Sugestões Contextuais</h3>
            </div>
            <div className="space-y-4 flex-1">
                {(() => {
                  const sorted = [...lifeAreasData].sort((a, b) => a.A - b.A);
                  const lowest = sorted[0];
                  const highest = sorted[sorted.length - 1];
                  
                  const suggestions: Record<string, string> = {
                    Mente: "Carga cognitiva baixa. Sugestão: Ativar protocolo 'Deep Work' por 45min.",
                    Corpo: "Manutenção biológica necessária. Sugestão: Aumentar hidratação e sono.",
                    Carreira: "Output profissional subótimo. Sugestão: Revisar objetivos trimestrais.",
                    Espírito: "Desalinhamento interno. Sugestão: 10min de reflexão solitária.",
                    Social: "Conexão de rede fraca. Sugestão: Agendar interação significativa.",
                    Finanças: "Alerta de recursos. Sugestão: Auditar saídas recentes."
                  };

                  const strengths: Record<string, string> = {
                    Mente: "Foco mental afiado. Aproveite para tarefas complexas.",
                    Corpo: "Vigor físico alto. Bom momento para treino intenso.",
                    Carreira: "Tração profissional forte. Mantenha o ritmo.",
                    Espírito: "Clareza de propósito elevada. Documente seus insights.",
                    Social: "Rede de apoio ativa. Fortaleça laços chaves.",
                    Finanças: "Estabilidade financeira detectada. Planeje investimentos."
                  };

                  return (
                    <>
                      <div className="p-4 bg-zinc-900/50 rounded-xl border-l-2 border-red-500">
                          <p className="text-sm text-zinc-300 font-medium leading-relaxed">
                              <span className="text-red-400 font-bold text-xs uppercase block mb-1">Atenção Necessária: {lowest.subject}</span>
                              {suggestions[lowest.subject] || "Analise esta área no Diário."}
                          </p>
                      </div>
                      <div className="p-4 bg-zinc-900/50 rounded-xl border-l-2 border-emerald-500">
                          <p className="text-sm text-zinc-300 font-medium leading-relaxed">
                              <span className="text-emerald-400 font-bold text-xs uppercase block mb-1">Ponto Forte: {highest.subject}</span>
                              {strengths[highest.subject] || "Mantenha a consistência."}
                          </p>
                      </div>
                    </>
                  );
                })()}
            </div>
        </div>

        {/* Existing Radar Chart (Now integrated) */}
        <div className="lg:col-span-2 bg-black/20 border border-zinc-800 rounded-3xl p-8 relative overflow-hidden backdrop-blur-sm">
          <div className="flex justify-between items-start mb-6 relative z-10">
            <h3 className="text-sm text-zinc-400 uppercase tracking-widest font-bold">Métricas de Vida</h3>
          </div>
          <div className="h-64 md:h-80 w-full flex items-center justify-center relative z-10">
            <CustomRadarChart data={lifeAreasData} />
          </div>
        </div>

      </div>
    </div>
  );
};

// RedView removed - now using RedViewReal component from ./components/RedViewReal

// Existing Tasks View (Preserved)
const TasksView = () => {
  const [localTasks, setLocalTasks] = useState<Array<{ id: number; text: string; completed: boolean }>>([]);
  const [isSaving, setIsSaving] = useState(false);

  const handleToggle = (id: number) => {
    setLocalTasks(localTasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const handleAdd = () => {
    const newId = Date.now();
    setLocalTasks([...localTasks, { id: newId, text: 'Nova Tarefa', completed: false }]);
  };

  const handleRemove = () => {
    setLocalTasks(localTasks.filter(t => !t.completed));
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => setIsSaving(false), 2000);
  };

  const handleTextChange = (id: number, newText: string) => {
    setLocalTasks(localTasks.map(t => t.id === id ? { ...t, text: newText } : t));
  };

  return (
    <div className="h-full w-full p-8 lg:p-12 overflow-y-auto">
      <h1 className="text-4xl font-bold text-white mb-2">Tarefas Gerais</h1>
      <p className="text-zinc-500 mb-12 font-medium max-w-2xl">
        Ambiente de alta performance. Execute uma micro-operação de cada vez da sua meta.
      </p>
      
      <div className="max-w-3xl space-y-4">
          {localTasks.length === 0 ? (
            <div className="py-16 text-center">
              <Check className="w-16 h-16 text-zinc-700 mx-auto mb-4" />
              <p className="text-zinc-500 font-medium mb-2">Nenhuma tarefa criada ainda</p>
              <p className="text-zinc-600 text-sm">Clique em "Adicionar" para criar sua primeira tarefa</p>
            </div>
          ) : (
            <AnimatePresence>
            {localTasks.map((task) => (
              <motion.div 
                key={task.id} 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, height: 0 }}
                className={cn(
                  "w-full p-6 border rounded-2xl flex items-center gap-6 transition-all group backdrop-blur-sm", 
                  task.completed 
                    ? "border-red-900/30 bg-red-900/10" 
                    : "border-white/5 bg-black/20 hover:border-white/10 hover:bg-black/40"
                )}
              >
                 <div 
                   onClick={() => handleToggle(task.id)}
                   className={cn(
                   "w-8 h-8 rounded-full border-2 flex items-center justify-center transition-colors cursor-pointer shrink-0", 
                   task.completed 
                    ? "border-red-700 bg-red-700" 
                    : "border-zinc-700 group-hover:border-zinc-500"
                 )}>
                   {task.completed && <Check className="w-4 h-4 text-white" />}
                 </div>
                 <input 
                   value={task.text}
                   onChange={(e) => handleTextChange(task.id, e.target.value)}
                   className={cn(
                     "text-lg font-medium transition-colors bg-transparent border-none focus:outline-none focus:ring-0 w-full", 
                     task.completed ? "text-zinc-600 line-through" : "text-zinc-200"
                   )} 
                 />
              </motion.div>
            ))}
            </AnimatePresence>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
             <button 
                onClick={handleAdd}
                className="py-4 border-2 border-dashed border-zinc-800 rounded-2xl text-zinc-500 font-bold uppercase tracking-widest hover:border-zinc-600 hover:text-zinc-300 transition-all bg-black/20 flex items-center justify-center gap-2"
             >
                <Plus className="w-4 h-4" /> Adicionar
             </button>
             
             <button 
                onClick={handleRemove}
                disabled={!localTasks.some(t => t.completed)}
                className="py-4 border-2 border-dashed border-zinc-800 rounded-2xl text-zinc-500 font-bold uppercase tracking-widest hover:border-red-900/50 hover:text-red-600 transition-all bg-black/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
             >
                <Trash2 className="w-4 h-4" /> Remover
             </button>
             
             <button 
                onClick={handleSave}
                className={cn(
                    "py-4 border-2 border-dashed rounded-2xl font-bold uppercase tracking-widest transition-all bg-black/20 flex items-center justify-center gap-2",
                    isSaving 
                        ? "border-emerald-500/50 text-emerald-500" 
                        : "border-zinc-800 text-zinc-500 hover:border-emerald-900/50 hover:text-emerald-500"
                )}
             >
                <Save className="w-4 h-4" /> {isSaving ? "Salvo" : "Salvar"}
             </button>
          </div>
      </div>
    </div>
  );
};

// Existing Challenges View (Updated with Actions)
const ChallengesView = () => {
  const [challenges, setChallenges] = useState(
    SYSTEM_CHALLENGES.map(c => ({ ...c, active: false }))
  );
  const [commitments, setCommitments] = useState<Commitment[]>([]);
  const [activeCommitments, setActiveCommitments] = useState<Record<string, string>>({});
  const [timers, setTimers] = useState<Record<string, string>>({});

  // Carregar compromissos do localStorage
  useEffect(() => {
    const saved = localStorage.getItem('focuslab_commitments');
    if (saved) {
      setCommitments(JSON.parse(saved));
    }
    const savedActive = localStorage.getItem('focuslab_active_commitments');
    if (savedActive) {
      setActiveCommitments(JSON.parse(savedActive));
    }
  }, []);

  // Atualizar cronômetros a cada segundo
  useEffect(() => {
    const interval = setInterval(() => {
      const newTimers: Record<string, string> = {};
      Object.entries(activeCommitments).forEach(([id, startTime]) => {
        const now = new Date();
        const start = new Date(startTime);
        const diff = now.getTime() - start.getTime();
        
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        
        newTimers[id] = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
      });
      setTimers(newTimers);
    }, 1000);

    return () => clearInterval(interval);
  }, [activeCommitments]);

  const toggleChallenge = (id: number) => {
    setChallenges(prev => prev.map(c => 
      c.id === id ? { ...c, active: !c.active } : c
    ));
  };

  const deleteChallenge = (id: number) => {
    setChallenges(prev => prev.filter(c => c.id !== id));
  };

  const addChallenge = () => {
    const newId = Math.max(0, ...challenges.map(c => c.id)) + 1;
    setChallenges([...challenges, {
      id: newId,
      title: 'Protocolo Personalizado',
      icon: Target,
      duration: 'Definir Prazo',
      desc: 'Novo protocolo de otimização comportamental.',
      active: false
    }]);
  };

  const deleteCommitment = (id: string) => {
    const updated = commitments.filter(c => c.id !== id);
    setCommitments(updated);
    localStorage.setItem('focuslab_commitments', JSON.stringify(updated));
  };

  const completeCommitment = (id: string) => {
    deleteCommitment(id);
  };

  const toggleCommitmentTimer = (id: string) => {
    if (activeCommitments[id]) {
      // Parar cronômetro
      const updated = { ...activeCommitments };
      delete updated[id];
      setActiveCommitments(updated);
      localStorage.setItem('focuslab_active_commitments', JSON.stringify(updated));
    } else {
      // Iniciar cronômetro
      const updated = { ...activeCommitments, [id]: new Date().toISOString() };
      setActiveCommitments(updated);
      localStorage.setItem('focuslab_active_commitments', JSON.stringify(updated));
    }
  };

  const getTimeRemaining = (deadline: string) => {
    const now = new Date();
    const end = new Date(deadline);
    const diff = end.getTime() - now.getTime();
    
    if (diff <= 0) return 'Prazo expirado';
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours < 24) {
      return `${hours}h ${minutes}m restantes`;
    } else {
      const days = Math.floor(hours / 24);
      return `${days}d ${hours % 24}h restantes`;
    }
  };

  return (
    <div className="p-8 lg:p-12 overflow-y-auto h-full">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
            <div>
                <h1 className="text-4xl font-bold text-white mb-2">Desafios</h1>
                <p className="text-zinc-500 font-medium">Protocolos de otimização comportamental.</p>
            </div>
            <button 
                onClick={addChallenge}
                className="flex items-center gap-2 px-6 py-3 bg-red-900/10 hover:bg-red-900/30 border border-red-900/30 text-red-500 rounded-xl text-xs font-bold uppercase tracking-widest transition-all hover:scale-105 active:scale-95"
            >
                <Plus className="w-4 h-4" /> Adicionar Meta
            </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
           <AnimatePresence>
           {challenges.map((challenge) => (
             <motion.div 
                key={challenge.id} 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className={cn(
                    "border rounded-3xl p-8 transition-all group relative overflow-hidden backdrop-blur-sm",
                    challenge.active 
                        ? "bg-red-900/10 border-red-500/50 shadow-[0_0_30px_rgba(185,28,28,0.1)]" 
                        : "bg-black/20 border-white/5 hover:border-red-900/30"
                )}
             >
                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                   <challenge.icon className="w-32 h-32 text-red-600" />
                </div>
                
                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-6">
                      <div className={cn(
                        "w-12 h-12 rounded-2xl flex items-center justify-center transition-transform shadow-lg shadow-black/50",
                        challenge.active ? "bg-red-600 text-white scale-110" : "bg-white/5 text-red-600 group-hover:scale-110"
                      )}>
                        <challenge.icon className="w-6 h-6" />
                      </div>
                      <button 
                        onClick={() => deleteChallenge(challenge.id)}
                        className="p-2 text-zinc-600 hover:text-red-500 transition-colors rounded-lg hover:bg-white/5"
                        title="Excluir Meta"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-2">{challenge.title}</h3>
                  <div className={cn(
                      "inline-block px-3 py-1 text-xs font-bold rounded-full mb-4 border transition-colors",
                      challenge.active 
                        ? "bg-red-600 text-white border-red-500" 
                        : "bg-red-900/20 text-red-400 border-red-900/30"
                  )}>
                    {challenge.active ? "EM ANDAMENTO" : challenge.duration}
                  </div>
                  <p className="text-zinc-400 text-sm leading-relaxed mb-8 h-10 line-clamp-2">
                    {challenge.desc}
                  </p>
                  <button 
                    onClick={() => toggleChallenge(challenge.id)}
                    className={cn(
                        "w-full py-3 rounded-xl font-bold text-sm transition-all shadow-lg flex items-center justify-center gap-2",
                        challenge.active 
                            ? "bg-zinc-900 text-zinc-400 hover:bg-zinc-800 hover:text-white" 
                            : "bg-zinc-800 text-white hover:bg-red-900"
                    )}
                  >
                    {challenge.active ? (
                        <>
                            <X className="w-4 h-4" /> ABANDONAR
                        </>
                    ) : (
                        <>
                            <Play className="w-4 h-4" /> INICIAR PROTOCOLO
                        </>
                    )}
                  </button>
                </div>
             </motion.div>
           ))}
           </AnimatePresence>
        </div>

        {/* Seção de Compromissos Registrados */}
        {commitments.length > 0 && (
          <div className="mt-16">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-2">Compromissos de Ação</h2>
              <p className="text-zinc-500 font-medium">Ações práticas vinculadas aos vídeos da Biblioteca Estratégica.</p>
            </div>
            
            <div className="space-y-4">
              <AnimatePresence>
                {commitments.map((commitment) => {
                  const timeRemaining = getTimeRemaining(commitment.deadline);
                  const isExpired = timeRemaining === 'Prazo expirado';
                  
                  return (
                    <motion.div
                      key={commitment.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -100 }}
                      className={cn(
                        "bg-black/20 border rounded-2xl p-6 backdrop-blur-sm transition-all",
                        isExpired ? "border-zinc-800/50" : "border-red-900/30 hover:border-red-900/50"
                      )}
                    >
                      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-start gap-3 mb-3">
                            <div className="w-10 h-10 rounded-xl bg-red-900/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                              <FileText className="w-5 h-5 text-red-500" />
                            </div>
                            <div className="flex-1">
                              <h3 className="text-white font-bold text-lg mb-1">{commitment.text}</h3>
                              <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-500">
                                <div className="flex items-center gap-1">
                                  <Video className="w-3 h-3" />
                                  <span>{commitment.videoTitle}</span>
                                </div>
                                <span>•</span>
                                <div className="flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  <span>{new Date(commitment.registeredAt).toLocaleDateString('pt-BR')}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <div className={cn(
                            "inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold border",
                            isExpired 
                              ? "bg-zinc-900/50 border-zinc-800 text-zinc-500" 
                              : "bg-red-900/20 border-red-900/50 text-red-400"
                          )}>
                            <Clock className="w-3 h-3" />
                            {timeRemaining}
                          </div>
                        </div>

                        <div className="flex gap-2 lg:flex-col">
                          <button
                            onClick={() => toggleCommitmentTimer(commitment.id)}
                            className={cn(
                              "flex-1 lg:flex-none px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2",
                              activeCommitments[commitment.id]
                                ? "bg-red-900/20 hover:bg-red-900/30 border border-red-900/50 text-red-400"
                                : "bg-emerald-900/20 hover:bg-emerald-900/30 border border-emerald-900/50 text-emerald-400"
                            )}
                          >
                            {activeCommitments[commitment.id] ? (
                              <>
                                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                                <span className="font-mono tabular-nums">{timers[commitment.id] || '00:00:00'}</span>
                              </>
                            ) : (
                              <>
                                <Play className="w-4 h-4" /> Iniciar
                              </>
                            )}
                          </button>
                          <button
                            onClick={() => deleteCommitment(commitment.id)}
                            className="flex-1 lg:flex-none px-4 py-2 bg-zinc-900/50 hover:bg-red-900/30 border border-zinc-800 hover:border-red-900/50 text-zinc-500 hover:text-red-400 rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2"
                          >
                            <Trash2 className="w-4 h-4" /> Excluir
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </div>
        )}
    </div>
  );
};

// Existing Weekly Goals View (Updated with Real Data)
const WeeklyGoalsView = ({ redTasks }: { redTasks: RedTask[] }) => {
  // Calculate today's completion based on RED tasks
  const completedCount = redTasks.filter(t => t.completed).length;
  const totalTasks = redTasks.length;
  const todayProgress = totalTasks > 0 ? Math.round((completedCount / totalTasks) * 100) : 0;

  // Simulate historical data (Mon-Sat) and inject Today's real data
  // Assuming today is Sunday for this example, or just the last entry
  const data = [
    { name: 'Seg', uv: 82 }, 
    { name: 'Ter', uv: 65 }, 
    { name: 'Qua', uv: 90 },
    { name: 'Qui', uv: 85 }, 
    { name: 'Sex', uv: 78 }, 
    { name: 'Sab', uv: 92 }, 
    { name: 'Hoje', uv: todayProgress }, // Real Data
  ];

  // Calculate specific category stats from RED tasks
  const readingTask = redTasks.find(t => t.text.toLowerCase().includes('leitura') || t.category === 'Mind');
  const trainingTask = redTasks.find(t => t.text.toLowerCase().includes('treino') || t.category === 'Bio');
  const deepWorkTask = redTasks.find(t => t.text.toLowerCase().includes('deep work') || t.category === 'Work');
  
  const metrics = [
      { 
          label: 'Meta de Leitura', 
          value: readingTask ? (readingTask.completed ? '100%' : '0%') : 'N/A',
          status: readingTask?.completed
      },
      { 
          label: 'Treinos', 
          value: trainingTask ? (trainingTask.completed ? '100%' : '0%') : 'N/A',
          status: trainingTask?.completed
      },
      { 
          label: 'Foco Profundo', 
          value: deepWorkTask ? (deepWorkTask.completed ? '100%' : '0%') : 'N/A',
          status: deepWorkTask?.completed
      },
      { 
          label: 'Consistência Geral', 
          value: `${todayProgress}%`,
          status: todayProgress >= 80
      }
  ];

  return (
    <div className="h-full w-full p-8 lg:p-12 overflow-y-auto">
      <div className="max-w-4xl mx-auto">
        <header className="mb-12">
          <h1 className="text-4xl font-bold text-white mb-2">Metas Semanais</h1>
          <p className="text-zinc-500 font-medium">Análise de consistência e aderência ao plano.</p>
        </header>

        <div className="mb-12 bg-black/20 rounded-3xl p-8 border border-white/5 backdrop-blur-sm">
          <div className="flex justify-between items-center mb-8">
             <h3 className="text-sm text-zinc-400 uppercase tracking-widest font-bold">Performance Semanal</h3>
             <div className="flex gap-4">
                <div className="flex items-center gap-2">
                   <div className="w-3 h-3 rounded-full bg-red-700" />
                   <span className="text-xs text-zinc-400 font-bold">Realizado</span>
                </div>
             </div>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#b91c1c" stopOpacity={0.3}/><stop offset="95%" stopColor="#b91c1c" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <Tooltip 
                    contentStyle={{ backgroundColor: '#18181b', border: '1px solid #3f3f46', borderRadius: '8px', color: '#fff' }}
                    itemStyle={{ color: '#fff' }}
                    labelStyle={{ color: '#a1a1aa' }}
                />
                <Area 
                    type="monotone" 
                    dataKey="uv" 
                    stroke="#b91c1c" 
                    strokeWidth={3} 
                    fillOpacity={1} 
                    fill="url(#colorUv)" 
                    animationDuration={1000}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
           {metrics.map((metric, i) => (
             <div key={i} className={cn(
                 "bg-black/20 border p-6 rounded-2xl flex flex-col items-center justify-center text-center backdrop-blur-sm transition-colors",
                 metric.status ? "border-red-900/30 bg-red-900/5" : "border-white/5"
             )}>
                <div className={cn(
                    "text-2xl font-bold mb-1 transition-colors",
                    metric.status ? "text-red-500" : "text-white"
                )}>{metric.value}</div>
                <div className="text-xs text-zinc-500 uppercase font-bold tracking-wider">{metric.label}</div>
             </div>
           ))}
        </div>
      </div>
    </div>
  );
};

// Existing Laboratory View (Project Writing) (Preserved but labeled as Project Lab)
const LaboratoryView = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [showPremiumModal, setShowPremiumModal] = useState(false);

  const handleCreateProject = () => {
    // Limit removed
    const newProject = {
      id: Date.now().toString(),
      title: 'Novo Projeto',
      content: '',
      lastEdited: 'Agora'
    };
    setProjects([...projects, newProject]);
    setActiveProject(newProject);
  };

  const handleDeleteProject = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setProjects(projects.filter(p => p.id !== id));
    if (activeProject?.id === id) setActiveProject(null);
  };

  // Helper to update both local state and projects list
  const updateProject = (updatedProject: typeof activeProject) => {
    if (!updatedProject) return;
    setActiveProject(updatedProject);
    setProjects(projects.map(p => p.id === updatedProject.id ? updatedProject : p));
  };

  if (activeProject) {
    return (
      <div className="h-full flex flex-col bg-black/20 backdrop-blur-md">
        <div className="border-b border-white/5 p-4 flex items-center justify-between bg-black/40">
          <button onClick={() => setActiveProject(null)} className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors font-bold text-sm uppercase tracking-wide">
            <ChevronLeft className="w-5 h-5" /> Voltar
          </button>
          <div className="flex items-center gap-4">
             <span className="text-zinc-500 text-xs font-bold uppercase tracking-widest">Editando</span>
             <button 
                onClick={(e) => handleDeleteProject(e as any, activeProject.id)}
                className="text-red-900 hover:text-red-500 transition-colors"
                title="Excluir Projeto"
             >
                <Trash2 className="w-5 h-5" />
             </button>
          </div>
        </div>
        <div className="flex-1 p-8 lg:p-12 max-w-4xl mx-auto w-full">
           <input 
             value={activeProject.title}
             onChange={(e) => updateProject({...activeProject, title: e.target.value})}
             className="w-full bg-transparent text-4xl font-bold text-white border-none focus:ring-0 placeholder:text-zinc-700 mb-8"
             placeholder="Título do Projeto"
           />
           <textarea 
             className="w-full h-[calc(100%-100px)] bg-transparent text-lg text-zinc-300 border-none focus:ring-0 resize-none placeholder:text-zinc-700 leading-relaxed font-medium"
             placeholder="Comece a escrever livremente..."
             value={activeProject.content}
             onChange={(e) => updateProject({...activeProject, content: e.target.value})}
           />
        </div>
      </div>
    )
  }

  return (
    <div className="p-8 lg:p-12 overflow-y-auto h-full relative">
      <div className="flex justify-between items-end mb-12">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">Laboratório de Projetos</h1>
          <p className="text-zinc-500 font-medium">Área de construção estratégica e organização mental.</p>
        </div>
        <div className="text-sm text-zinc-500 font-medium">
          <span className="text-emerald-500">{projects.length}</span> Projetos Ativos
        </div>
      </div>

      {projects.length === 0 ? (
        <div className="py-16 text-center max-w-2xl mx-auto">
          <Atom className="w-16 h-16 text-zinc-700 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">Nenhum projeto criado ainda</h3>
          <p className="text-zinc-500 font-medium mb-8">
            O Laboratório é seu espaço para desenvolver ideias, escrever livros, documentar estratégias e organizar pensamentos complexos.
          </p>
          <button 
            onClick={handleCreateProject}
            className="px-8 py-4 bg-red-900 hover:bg-red-800 text-white rounded-xl font-bold transition-colors shadow-lg shadow-red-900/20 inline-flex items-center gap-3"
          >
            <Plus className="w-5 h-5" />
            CRIAR PRIMEIRO PROJETO
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Create New Block */}
          <button 
            onClick={handleCreateProject}
            className="aspect-[4/3] border-2 border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center text-zinc-600 hover:border-emerald-900 hover:text-emerald-600 hover:bg-emerald-900/10 transition-all group bg-black/20"
          >
            <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-inner">
               <Plus className="w-6 h-6" />
            </div>
            <span className="font-bold uppercase tracking-widest text-xs">Novo Projeto</span>
          </button>

          {/* Existing Projects */}
          <AnimatePresence>
          {projects.map(project => (
          <motion.div 
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            key={project.id}
            onClick={() => setActiveProject(project)}
            className="aspect-[4/3] bg-black/40 border border-white/5 rounded-2xl p-6 cursor-pointer hover:border-white/20 transition-all flex flex-col justify-between group relative overflow-hidden backdrop-blur-sm"
          >
            <div className="absolute top-0 left-0 w-1 h-full bg-red-900 group-hover:bg-red-600 transition-colors shadow-[0_0_15px_rgba(185,28,28,0.5)]" />
            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                    onClick={(e) => handleDeleteProject(e, project.id)}
                    className="p-2 bg-black/50 hover:bg-red-900 text-zinc-400 hover:text-white rounded-lg transition-colors"
                >
                    <Trash2 className="w-4 h-4" />
                </button>
            </div>
            <div>
               <h3 className="text-xl font-bold text-white mb-2 group-hover:text-red-200 transition-colors pr-8 truncate">{project.title}</h3>
               <p className="text-zinc-500 text-sm line-clamp-3 font-medium">
                 {project.content || "Sem conteúdo..."}
               </p>
            </div>
            <div className="flex justify-between items-center border-t border-white/5 pt-4 mt-4">
               <span className="text-xs text-zinc-600 font-mono">{project.lastEdited}</span>
               <ArrowRight className="w-4 h-4 text-zinc-700 group-hover:text-white transition-colors" />
            </div>
          </motion.div>
        ))}
        </AnimatePresence>
      </div>
    )}
    </div>
  );
};

// NEW: Library View with Video Programs
const LibraryView = () => {
    const [libraryType, setLibraryType] = useState<'courses' | 'books'>('courses');
    const [activeCategory, setActiveCategory] = useState<string | null>(null);
    const [commitmentText, setCommitmentText] = useState("");
    const [commitments, setCommitments] = useState<Commitment[]>([]);
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);

    const handleRegisterCommitment = () => {
        if (!commitmentText.trim()) return;

        const currentCategory = libraryType === 'courses' 
            ? VIDEO_CATEGORIES.find(c => c.id === activeCategory)
            : BOOK_CATEGORIES.find(c => c.id === activeCategory);

        const sourceTitle = libraryType === 'courses' 
            ? 'Aula 01: Mecanismos da Dopamina'
            : 'Atomic Habits - James Clear';

        const newCommitment: Commitment = {
            id: Date.now().toString(),
            text: commitmentText,
            category: activeCategory || 'general',
            videoTitle: sourceTitle,
            registeredAt: new Date().toISOString(),
            deadline: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString() // 48 horas
        };

        setCommitments([...commitments, newCommitment]);
        setShowSuccessMessage(true);
        
        // Salvar no localStorage
        localStorage.setItem('focuslab_commitments', JSON.stringify([...commitments, newCommitment]));

        setTimeout(() => {
            setShowSuccessMessage(false);
        }, 3000);
    };

    // Carregar compromissos do localStorage ao montar
    useEffect(() => {
        const saved = localStorage.getItem('focuslab_commitments');
        if (saved) {
            setCommitments(JSON.parse(saved));
        }
    }, []);
  
    return (
      <div className="h-full w-full overflow-y-auto">
          {!activeCategory ? (
              <div className="p-8 lg:p-12">
                  <header className="mb-12">
                      <h1 className="text-4xl font-bold text-white mb-2">Biblioteca Estratégica</h1>
                      <p className="text-zinc-500 font-medium">Conteúdo operacional. Consuma e execute.</p>
                  </header>
                  
                  {/* Tabs for Courses and Books */}
                  <div className="flex gap-4 mb-8 border-b border-white/5">
                      <button
                          onClick={() => { setLibraryType('courses'); setActiveCategory(null); }}
                          className={cn(
                              "px-6 py-3 font-bold text-sm uppercase tracking-widest transition-all relative",
                              libraryType === 'courses'
                                  ? "text-red-500 border-b-2 border-red-500"
                                  : "text-zinc-500 hover:text-zinc-300"
                          )}
                      >
                          <Video className="w-4 h-4 inline-block mr-2 mb-0.5" />
                          Cursos
                      </button>
                      <button
                          onClick={() => { setLibraryType('books'); setActiveCategory(null); }}
                          className={cn(
                              "px-6 py-3 font-bold text-sm uppercase tracking-widest transition-all relative",
                              libraryType === 'books'
                                  ? "text-red-500 border-b-2 border-red-500"
                                  : "text-zinc-500 hover:text-zinc-300"
                          )}
                      >
                          <BookOpen className="w-4 h-4 inline-block mr-2 mb-0.5" />
                          Livros
                      </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                      {(libraryType === 'courses' ? VIDEO_CATEGORIES : BOOK_CATEGORIES).map((cat) => (
                          <div 
                              key={cat.id} 
                              onClick={() => setActiveCategory(cat.id)}
                              className="bg-black/20 border border-white/5 rounded-2xl p-6 hover:border-red-900/50 hover:bg-red-900/5 transition-all cursor-pointer group"
                          >
                              <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform text-zinc-400 group-hover:text-red-500">
                                  <cat.icon className="w-6 h-6" />
                              </div>
                              <h3 className="text-lg font-bold text-white mb-2">{cat.title}</h3>
                              <p className="text-zinc-500 text-sm leading-relaxed">{cat.desc}</p>
                          </div>
                      ))}
                  </div>
              </div>
          ) : libraryType === 'courses' ? (
              <div className="h-full flex flex-col">
                  <div className="border-b border-white/5 p-6 flex items-center gap-4 bg-black/40 backdrop-blur-md sticky top-0 z-20">
                      <button onClick={() => setActiveCategory(null)} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                          <ChevronLeft className="w-6 h-6 text-zinc-400" />
                      </button>
                      <div>
                          <h2 className="text-xl font-bold text-white">{VIDEO_CATEGORIES.find(c => c.id === activeCategory)?.title}</h2>
                          <div className="flex gap-2 text-xs text-zinc-500 font-medium uppercase tracking-wider">
                              <span>Módulo 1</span>
                              <span>•</span>
                              <span>3 Vídeos</span>
                          </div>
                      </div>
                  </div>
                  
                  <div className="flex-1 p-8 lg:p-12 max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-3 gap-8">
                      {/* Video Player Area */}
                      <div className="lg:col-span-2">
                          <div className="aspect-video bg-zinc-900 rounded-2xl border border-white/10 flex items-center justify-center relative group overflow-hidden shadow-2xl">
                               <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-60" />
                               <Play className="w-16 h-16 text-white opacity-80 group-hover:scale-110 transition-transform cursor-pointer z-10" fill="white" />
                               <div className="absolute bottom-6 left-6 z-10">
                                   <h3 className="text-2xl font-bold text-white mb-1">Aula 01: Mecanismos da Dopamina</h3>
                                   <p className="text-zinc-400 text-sm">Neurociência aplicada à motivação diária.</p>
                               </div>
                          </div>
  
                          <div className="mt-8">
                              <h3 className="text-lg font-bold text-white mb-4">Compromisso de Ação</h3>
                              <div className="bg-red-900/10 border border-red-900/30 p-6 rounded-2xl">
                                  <p className="text-zinc-300 text-sm mb-4 leading-relaxed">
                                      Para concluir este módulo, você deve registrar uma ação prática vinculada ao conteúdo.
                                  </p>
                                  <div className="mb-4">
                                      <label className="text-xs text-zinc-400 font-bold uppercase mb-2 block">Seu Compromisso de Ação</label>
                                      <textarea
                                          value={commitmentText}
                                          onChange={(e) => setCommitmentText(e.target.value)}
                                          className="w-full bg-black/40 border border-red-900/50 rounded-xl px-4 py-3 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-red-600 min-h-[100px] resize-y font-medium leading-relaxed"
                                          placeholder="Descreva a ação específica que você se compromete a realizar nas próximas 48h..."
                                      />
                                  </div>
                                  {showSuccessMessage && (
                                      <motion.div 
                                          initial={{ opacity: 0, y: -10 }}
                                          animate={{ opacity: 1, y: 0 }}
                                          className="mb-4 p-3 bg-emerald-500/20 border border-emerald-500/50 rounded-lg flex items-center gap-2"
                                      >
                                          <Check className="w-4 h-4 text-emerald-400" />
                                          <span className="text-emerald-400 text-sm font-bold">Compromisso registrado com sucesso!</span>
                                      </motion.div>
                                  )}
                                  <button 
                                      onClick={handleRegisterCommitment}
                                      disabled={!commitmentText.trim()}
                                      className="w-full py-3 bg-red-900 hover:bg-red-800 text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2 text-sm uppercase tracking-wide disabled:opacity-50 disabled:cursor-not-allowed"
                                  >
                                      <Plus className="w-4 h-4" /> Registrar Compromisso (48h)
                                  </button>
                              </div>
                          </div>
                      </div>
  
                      {/* Playlist / Modules */}
                      <div className="space-y-2">
                          {[1,2,3,4].map((i) => (
                              <div key={i} className={cn(
                                  "p-4 rounded-xl flex items-center gap-4 cursor-pointer transition-all",
                                  i === 1 ? "bg-white/10 border border-white/10" : "hover:bg-white/5 border border-transparent"
                              )}>
                                  <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-xs font-bold text-zinc-500">
                                      0{i}
                                  </div>
                                  <div>
                                      <h4 className={cn("text-sm font-bold", i===1 ? "text-white" : "text-zinc-400")}>Conceito Fundamental {i}</h4>
                                      <span className="text-xs text-zinc-600">12:30 min</span>
                                  </div>
                                  {i === 1 && <div className="ml-auto w-2 h-2 rounded-full bg-red-600 animate-pulse" />}
                              </div>
                          ))}
                      </div>
                  </div>
              </div>
          ) : (
              // Books Detail View
              <div className="h-full flex flex-col">
                  <div className="border-b border-white/5 p-6 flex items-center gap-4 bg-black/40 backdrop-blur-md sticky top-0 z-20">
                      <button onClick={() => setActiveCategory(null)} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                          <ChevronLeft className="w-6 h-6 text-zinc-400" />
                      </button>
                      <div>
                          <h2 className="text-xl font-bold text-white">{BOOK_CATEGORIES.find(c => c.id === activeCategory)?.title}</h2>
                          <div className="flex gap-2 text-xs text-zinc-500 font-medium uppercase tracking-wider">
                              <span>Livro Recomendado</span>
                              <span>•</span>
                              <span>Leitura Estratégica</span>
                          </div>
                      </div>
                  </div>
                  
                  <div className="flex-1 p-8 lg:p-12 max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-3 gap-8">
                      {/* Book Cover and Info */}
                      <div className="lg:col-span-2">
                          <div className="bg-zinc-900 rounded-2xl border border-white/10 p-8 flex flex-col md:flex-row gap-8 relative overflow-hidden shadow-2xl">
                               <div className="absolute top-0 right-0 p-12 opacity-5">
                                   <BookOpen className="w-64 h-64 text-red-600" />
                               </div>
                               
                               {/* Book Cover Placeholder */}
                               <div className="w-48 h-72 bg-gradient-to-br from-red-900 to-zinc-900 rounded-xl flex items-center justify-center flex-shrink-0 shadow-2xl relative z-10 border border-white/10">
                                   <BookOpen className="w-16 h-16 text-white opacity-50" />
                               </div>
                               
                               {/* Book Details */}
                               <div className="flex-1 relative z-10">
                                   <h3 className="text-3xl font-bold text-white mb-2">Atomic Habits</h3>
                                   <p className="text-red-500 font-bold text-sm mb-4">James Clear</p>
                                   <div className="flex flex-wrap gap-2 mb-6">
                                       <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs font-bold text-zinc-400">Hábitos</span>
                                       <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs font-bold text-zinc-400">Produtividade</span>
                                       <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs font-bold text-zinc-400">Comportamento</span>
                                   </div>
                                   <p className="text-zinc-400 text-sm leading-relaxed mb-4">
                                       Um guia prático e comprovado para construir bons hábitos e eliminar os ruins. Clear apresenta estratégias baseadas em ciência para criar mudanças incrementais que levam a resultados extraordinários.
                                   </p>
                                   <div className="space-y-2">
                                       <div className="flex items-center gap-2 text-xs text-zinc-500">
                                           <Clock className="w-3 h-3" />
                                           <span>Leitura estimada: 6-8 horas</span>
                                       </div>
                                       <div className="flex items-center gap-2 text-xs text-zinc-500">
                                           <Target className="w-3 h-3" />
                                           <span>Nível: Intermediário</span>
                                       </div>
                                   </div>
                               </div>
                          </div>
                      </div>
  
                      {/* Key Concepts / Chapters */}
                      <div className="space-y-2">
                          <h4 className="text-xs text-zinc-500 uppercase font-bold tracking-widest mb-4">Conceitos-Chave</h4>
                          {[
                              { id: 1, title: 'As 4 Leis da Mudança de Comportamento', desc: 'Framework fundamental' },
                              { id: 2, title: 'Hábitos Atômicos', desc: 'Mudanças incrementais' },
                              { id: 3, title: 'Sistema de Identidade', desc: 'Construção de quem você é' },
                              { id: 4, title: 'Ambiente e Design', desc: 'Arquitetura de escolhas' }
                          ].map((concept, i) => (
                              <div key={concept.id} className={cn(
                                  "p-4 rounded-xl flex items-start gap-4 cursor-pointer transition-all",
                                  i === 0 ? "bg-white/10 border border-white/10" : "hover:bg-white/5 border border-transparent"
                              )}>
                                  <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-xs font-bold text-zinc-500 flex-shrink-0">
                                      0{concept.id}
                                  </div>
                                  <div className="flex-1">
                                      <h5 className={cn("text-sm font-bold mb-0.5", i===0 ? "text-white" : "text-zinc-400")}>{concept.title}</h5>
                                      <span className="text-xs text-zinc-600">{concept.desc}</span>
                                  </div>
                                  {i === 0 && <div className="w-2 h-2 rounded-full bg-red-600 animate-pulse flex-shrink-0 mt-2" />}
                              </div>
                          ))}
                      </div>
                  </div>
              </div>
          )}
      </div>
    );
};

const JournalView = () => {
    const [sessionActive, setSessionActive] = useState(false);
    const [showAnalysis, setShowAnalysis] = useState(false);
    const [analysisResults, setAnalysisResults] = useState<{
        patterns: string[];
        insights: string[];
        interventions: { title: string; desc: string; priority: 'high' | 'medium' | 'low' }[];
        redAdjustments: string[];
    } | null>(null);
    const [entries, setEntries] = useState({
        q1: '',
        q2: '',
        q3: '',
        q4: ''
    });

    const questions = [
        { id: 'q1', text: 'O que impediu você de completar 100% da R.E.D. hoje?', placeholder: 'Identifique gatilhos, padrões ou situações específicas...' },
        { id: 'q2', text: 'Qual foi o momento exato em que você desviou do protocolo?', placeholder: 'Hora, contexto, estado emocional...' },
        { id: 'q3', text: 'Que sistema ou barreira pode prevenir isso amanhã?', placeholder: 'Seja específico e actionável...' },
        { id: 'q4', text: 'Reflexão livre: O que você aprendeu sobre si mesmo hoje?', placeholder: 'Escreva livremente sem julgamento...' }
    ];

    const analyzeEntries = () => {
        const allText = Object.values(entries).join(' ').toLowerCase();
        
        const patterns: string[] = [];
        const insights: string[] = [];
        const interventions: { title: string; desc: string; priority: 'high' | 'medium' | 'low' }[] = [];
        const redAdjustments: string[] = [];

        // Detectar horários problemáticos
        if (/manhã|cedo|acordar|despertar|início do dia/i.test(allText)) {
            patterns.push('Vulnerabilidade identificada no período da manhã');
            interventions.push({
                title: 'Protocolo de Ativação Matinal',
                desc: 'Implementar sequência de 15min: luz natural + hidratação + movimento antes de qualquer tela.',
                priority: 'high'
            });
        }
        
        if (/tarde|14|15|16|17|18|pós-almoço/i.test(allText)) {
            patterns.push('Vulnerabilidade identificada no período da tarde');
            interventions.push({
                title: 'Protocolo Anti-Queda Vespertina',
                desc: 'Implementar pausa estratégica às 15h com 10min de caminhada + hidratação. Bloquear redes sociais entre 14h-18h.',
                priority: 'high'
            });
            redAdjustments.push('Adicionar "Pausa Estratégica 15h" como tarefa obrigatória na R.E.D.');
        }
        
        if (/noite|21|22|23|24|madrugada|antes de dormir/i.test(allText)) {
            patterns.push('Vulnerabilidade identificada no período da noite');
            interventions.push({
                title: 'Rotina de Desligamento Noturno',
                desc: 'Estabelecer shutdown ritual às 21h: desligar notificações, preparar ambiente para o próximo dia, leitura física.',
                priority: 'high'
            });
            redAdjustments.push('Antecipar horário de término do foco principal em 30 minutos.');
        }

        // Detectar gatilhos emocionais
        if (/cansaço|cansado|exausto|sem energia|fadiga/i.test(allText)) {
            patterns.push('Estado emocional detectado: cansaço');
            insights.push('O cansaço aparece como fator de ruptura. Isso indica necessidade de ajuste na carga ou no tipo de atividade, não falta de disciplina.');
            interventions.push({
                title: 'Otimização de Energia',
                desc: 'Revisar qualidade do sono e hidratação. Considerar reduzir 20% da carga da R.E.D. por 3 dias para recalibrar.',
                priority: 'high'
            });
        }
        
        if (/ansioso|ansiedade|nervoso|preocupado|estressado/i.test(allText)) {
            patterns.push('Estado emocional detectado: ansiedade');
            insights.push('A ansiedade aparece como fator de ruptura. Isso indica necessidade de ajuste na carga ou no tipo de atividade, não falta de disciplina.');
            interventions.push({
                title: 'Protocolo de Ancoragem',
                desc: 'Implementar 5 minutos de respiração controlada (box breathing) antes de cada bloco de foco.',
                priority: 'medium'
            });
        }

        // Detectar gatilhos tecnológicos
        if (/instagram|facebook|twitter|tiktok|youtube|redes sociais|social media/i.test(allText)) {
            patterns.push('Gatilho digital identificado: redes sociais');
            interventions.push({
                title: 'Contenção Digital Cirúrgica',
                desc: 'Bloqueio físico: redes sociais fora do ambiente de trabalho durante blocos de foco. Use app blocker (Freedom/Cold Turkey) com senha de terceiro.',
                priority: 'high'
            });
            redAdjustments.push('Adicionar verificação de bloqueio de redes sociais como primeira tarefa da R.E.D.');
        }
        
        if (/celular|smartphone|telefone|notificação|notificações/i.test(allText)) {
            patterns.push('Gatilho digital identificado: celular');
            interventions.push({
                title: 'Contenção Digital Cirúrgica',
                desc: 'Bloqueio físico: celular fora do ambiente de trabalho durante blocos de foco. Use app blocker com senha de terceiro.',
                priority: 'high'
            });
            redAdjustments.push('Adicionar verificação de bloqueio de celular como primeira tarefa da R.E.D.');
        }

        // Detectar procrastinação
        if (/procrastin|adiar|depois|amanhã|deixei para|empurr/i.test(allText)) {
            patterns.push('Padrão de evasão temporal detectado');
            insights.push('Procrastinação não é preguiça, é ansiedade disfarçada. A tarefa precisa ser quebrada em componentes menores.');
            interventions.push({
                title: 'Regra dos 2 Minutos',
                desc: 'Quebrar primeira tarefa em micro-ação de 2min. Ex: ao invés de "escrever relatório", começar com "abrir documento e escrever título".',
                priority: 'high'
            });
        }

        // Detectar falta de estrutura
        if (/não sabia|perdido|sem direção|confuso|desorgan/i.test(allText)) {
            insights.push('Falta de clareza estrutural está gerando fricção. O problema não é você, é o sistema.');
            interventions.push({
                title: 'Checklist Pré-Execução',
                desc: 'Criar lista detalhada na noite anterior: cada tarefa com hora específica, local e primeiros 3 passos escritos.',
                priority: 'medium'
            });
            redAdjustments.push('Adicionar "Planejamento do Dia Seguinte" como última tarefa da R.E.D.');
        }

        // Análise de autoconsciência
        if (entries.q4.length > 50) {
            insights.push('Alto nível de reflexão detectado. Isso indica capacidade de auto-observação - use isso como vantagem estratégica.');
        } else if (entries.q4.length < 20 && entries.q4.length > 0) {
            interventions.push({
                title: 'Desenvolver Meta-Consciência',
                desc: 'Dedicar 5min diários apenas para observar seus padrões sem julgamento. Anotar gatilhos recorrentes.',
                priority: 'low'
            });
        }

        if (patterns.length === 0) {
            patterns.push('Dados insuficientes para análise profunda');
            insights.push('Continue registrando por 7 dias para identificar padrões mais sutis.');
        }

        if (entries.q3.length > 30) {
            insights.push('Você já identificou possíveis soluções. O próximo passo é transformá-las em barreiras físicas, não apenas intenções.');
            redAdjustments.push('Implementar a solução que você descreveu como tarefa teste na R.E.D. de amanhã.');
        }

        return { patterns, insights, interventions, redAdjustments };
    };

    const handleSaveSession = () => {
        const analysis = analyzeEntries();
        setAnalysisResults(analysis);
        setShowAnalysis(true);
        setSessionActive(false);
    };

    const handleCloseAnalysis = () => {
        setShowAnalysis(false);
        setEntries({ q1: '', q2: '', q3: '', q4: '' });
    };

    // Analysis Results View
    if (showAnalysis && analysisResults) {
        return (
            <div className="h-full w-full p-8 lg:p-12 overflow-y-auto">
                <div className="max-w-4xl mx-auto">
                    <header className="mb-12">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                                <Brain className="w-5 h-5 text-emerald-500" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-white tracking-tight">Análise Contextual Concluída</h1>
                                <p className="text-zinc-500 font-medium">Sistema detectou {analysisResults.patterns.length} padrão(ões) e gerou {analysisResults.interventions.length} intervenção(ões)</p>
                            </div>
                        </div>
                    </header>

                    {/* Padrões Identificados */}
                    <div className="mb-8">
                        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                            <Target className="w-5 h-5 text-red-500" />
                            Padrões Identificados
                        </h2>
                        <div className="space-y-3">
                            {analysisResults.patterns.map((pattern, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    className="bg-red-900/10 border border-red-900/30 rounded-xl p-4 flex items-start gap-3"
                                >
                                    <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2 flex-shrink-0" />
                                    <p className="text-zinc-300 font-medium">{pattern}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Insights */}
                    {analysisResults.insights.length > 0 && (
                        <div className="mb-8">
                            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                <Zap className="w-5 h-5 text-amber-500" />
                                Insights
                            </h2>
                            <div className="space-y-3">
                                {analysisResults.insights.map((insight, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: (analysisResults.patterns.length + i) * 0.1 }}
                                        className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4"
                                    >
                                        <p className="text-zinc-300 font-medium leading-relaxed">{insight}</p>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Intervenções Recomendadas */}
                    <div className="mb-8">
                        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                            <Shield className="w-5 h-5 text-emerald-500" />
                            Intervenções Recomendadas
                        </h2>
                        <div className="space-y-4">
                            {analysisResults.interventions.map((intervention, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: (analysisResults.patterns.length + analysisResults.insights.length + i) * 0.1 }}
                                    className={cn(
                                        "border rounded-2xl p-6",
                                        intervention.priority === 'high' && "bg-red-900/10 border-red-900/30",
                                        intervention.priority === 'medium' && "bg-orange-900/10 border-orange-900/30",
                                        intervention.priority === 'low' && "bg-zinc-900/30 border-white/10"
                                    )}
                                >
                                    <div className="flex items-start justify-between mb-3">
                                        <h3 className="text-white font-bold text-lg">{intervention.title}</h3>
                                        <span className={cn(
                                            "text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider",
                                            intervention.priority === 'high' && "bg-red-500/20 text-red-400",
                                            intervention.priority === 'medium' && "bg-orange-500/20 text-orange-400",
                                            intervention.priority === 'low' && "bg-zinc-700 text-zinc-400"
                                        )}>
                                            {intervention.priority === 'high' ? 'CRÍTICO' : intervention.priority === 'medium' ? 'MÉDIO' : 'BAIXO'}
                                        </span>
                                    </div>
                                    <p className="text-zinc-300 font-medium leading-relaxed">{intervention.desc}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Ajustes na R.E.D. */}
                    {analysisResults.redAdjustments.length > 0 && (
                        <div className="mb-8">
                            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                <Settings className="w-5 h-5 text-blue-500" />
                                Ajustes Recomendados na R.E.D.
                            </h2>
                            <div className="bg-blue-900/10 border border-blue-900/30 rounded-2xl p-6">
                                <ul className="space-y-3">
                                    {analysisResults.redAdjustments.map((adjustment, i) => (
                                        <li key={i} className="flex items-start gap-3">
                                            <Check className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                                            <span className="text-zinc-300 font-medium">{adjustment}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    )}

                    <div className="flex gap-4">
                        <button 
                            onClick={handleCloseAnalysis}
                            className="flex-1 px-8 py-4 bg-red-900 hover:bg-red-800 text-white rounded-xl font-bold transition-colors shadow-lg shadow-red-900/20"
                        >
                            IMPLEMENTAR MUDANÇAS
                        </button>
                        <button 
                            onClick={() => setShowAnalysis(false)}
                            className="px-8 py-4 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl font-bold transition-colors"
                        >
                            REVISAR DEPOIS
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (sessionActive) {
        return (
            <div className="h-full w-full p-8 lg:p-12 overflow-y-auto">
                <div className="max-w-3xl mx-auto">
                    <header className="mb-12 flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Sessão Noturna</h1>
                            <p className="text-zinc-500 font-medium">Responda com honestidade. Seus dados serão analisados pela IA.</p>
                        </div>
                        <button 
                            onClick={() => setSessionActive(false)}
                            className="text-zinc-500 hover:text-white transition-colors"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </header>

                    <div className="space-y-8">
                        {questions.map((question, index) => (
                            <motion.div 
                                key={question.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-black/20 border border-white/5 rounded-3xl p-8 backdrop-blur-sm"
                            >
                                <div className="flex items-start gap-4 mb-4">
                                    <div className="w-8 h-8 rounded-lg bg-red-900/20 flex items-center justify-center flex-shrink-0">
                                        <span className="text-red-400 font-bold text-sm">{index + 1}</span>
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-white font-bold text-lg mb-4">{question.text}</h3>
                                        <textarea 
                                            value={entries[question.id as keyof typeof entries]}
                                            onChange={(e) => setEntries({ ...entries, [question.id]: e.target.value })}
                                            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-red-600 min-h-[120px] resize-y font-medium leading-relaxed"
                                            placeholder={question.placeholder}
                                        />
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    <div className="mt-12 flex gap-4">
                        <button 
                            onClick={handleSaveSession}
                            className="flex-1 px-8 py-4 bg-red-900 hover:bg-red-800 text-white rounded-xl font-bold transition-colors shadow-lg shadow-red-900/20"
                        >
                            SALVAR SESSÃO
                        </button>
                        <button 
                            onClick={() => setSessionActive(false)}
                            className="px-8 py-4 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl font-bold transition-colors"
                        >
                            CANCELAR
                        </button>
                    </div>

                    <div className="mt-8 p-6 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl">
                        <div className="flex items-start gap-3">
                            <Zap className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                            <p className="text-sm text-zinc-300 font-medium leading-relaxed">
                                <span className="text-emerald-400 font-bold">IA Contextual:</span> Suas respostas serão analisadas para ajustar a dificuldade da R.E.D. e sugerir intervenções personalizadas.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="h-full w-full p-8 lg:p-12 overflow-y-auto flex flex-col items-center justify-center text-center">
            <FileText className="w-16 h-16 text-zinc-700 mb-6" />
            <h2 className="text-2xl font-bold text-white mb-2">Diário de Reconfiguração</h2>
            <p className="text-zinc-500 max-w-md mb-8">
                Transforme falhas em dados. O diário adapta perguntas com base nos seus erros da R.E.D.
            </p>
            <button 
                onClick={() => setSessionActive(true)}
                className="px-8 py-3 bg-zinc-800 text-white rounded-xl font-bold hover:bg-zinc-700 transition-colors"
            >
                Iniciar Sessão Noturna
            </button>
        </div>
    );
};

// Import Journey View
import { JourneyView } from './components/JourneyView';

const CoworkingView = () => (
    <div className="h-full w-full p-8 lg:p-12 overflow-y-auto">
        <header className="mb-12">
            <h1 className="text-4xl font-bold text-white mb-2">Espaços de Foco</h1>
            <p className="text-zinc-500 font-medium">Trabalho profundo sincronizado. Câmera opcional. Sem chat.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-black/20 border border-white/5 rounded-3xl p-8 backdrop-blur-sm relative overflow-hidden">
                <div className="flex justify-between items-center mb-8">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-red-600 rounded-full animate-pulse" />
                        <span className="text-white font-bold">Sala Alpha</span>
                    </div>
                    <div className="text-zinc-500 text-xs font-bold uppercase tracking-widest">3/4 Ocupado</div>
                </div>
                
                <div className="flex justify-center my-8">
                    <div className="text-6xl font-bold text-white font-mono tracking-tighter">24:59</div>
                </div>
                <div className="text-center text-zinc-500 text-sm mb-8 uppercase tracking-widest">Ciclo de Foco Ativo</div>

                <div className="flex justify-center -space-x-4 mb-8">
                    {[1,2,3].map(i => (
                        <div key={i} className="w-12 h-12 rounded-full bg-zinc-800 border-2 border-black flex items-center justify-center text-xs font-bold text-zinc-400">
                           USR
                        </div>
                    ))}
                    <div className="w-12 h-12 rounded-full bg-zinc-900 border-2 border-dashed border-zinc-700 flex items-center justify-center text-zinc-500 text-xs">
                        +1
                    </div>
                </div>

                <button className="w-full py-4 bg-red-900 text-white font-bold rounded-xl hover:bg-red-800 transition-colors">
                    ENTRAR NA SALA
                </button>
            </div>
        </div>
    </div>
);

// 4. Main App
export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUserEmail, setCurrentUserEmail] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [view, setView] = useState<ViewState>('command_center');
  const [alternatives, setAlternatives] = useState("");

  // Check authentication state on mount and handle OAuth redirects
  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log('Verificando sessão inicial...');
        
        // Verifica se veio de confirmação de email
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const accessToken = hashParams.get('access_token');
        const type = hashParams.get('type');
        
        if (type === 'signup' && accessToken) {
          console.log('Confirmação de email detectada, autenticando...');
          toast.success('Email confirmado com sucesso! Bem-vindo ao Focus Lab.');
          // Limpa a URL
          window.history.replaceState({}, document.title, window.location.pathname);
        }
        
        const { data: { session } } = await supabase.auth.getSession();
        console.log('Sessão atual:', session);
        
        if (session) {
          console.log('Sessão ativa encontrada, autenticando usuário');
          setIsAuthenticated(true);
          setCurrentUserEmail(session.user?.email || null);
          setCurrentUserId(session.user?.id || null);
          
          // Mostra toast apenas se veio de OAuth ou confirmação de email
          if (window.location.hash.includes('access_token')) {
            if (!type || type !== 'signup') {
              toast.success('Acesso autorizado. Bem-vindo ao Núcleo.');
            }
            // Limpa a URL
            window.history.replaceState({}, document.title, window.location.pathname);
          }
        }
      } catch (error) {
        console.error('Auth check error:', error);
      } finally {
        setIsCheckingAuth(false);
      }
    };
    checkAuth();

    // Listen for auth state changes (important for OAuth and email confirmation)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session);
      
      if (event === 'SIGNED_IN' && session) {
        console.log('SIGNED_IN evento detectado, autenticando...');
        setIsAuthenticated(true);
        setCurrentUserEmail(session.user?.email || null);
        setCurrentUserId(session.user?.id || null);
        setIsCheckingAuth(false);
        toast.success('Acesso autorizado. Bem-vindo ao Núcleo.');
      } else if (event === 'SIGNED_OUT') {
        console.log('SIGNED_OUT evento detectado');
        setIsAuthenticated(false);
        setCurrentUserEmail(null);
        setCurrentUserId(null);
      } else if (event === 'TOKEN_REFRESHED') {
        console.log('Token atualizado');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const { tasks: redTasks, loading: tasksLoading, toggleTask, updateTask, addTask, removeTask } = useRedTasks(currentUserId);
  const { objective, loading: objectiveLoading, updateObjective, createObjective } = useFocusObjective(currentUserId);

  // Focus Objective default values handled in hooks and RedViewReal

  // Reset Logic: 00:00 (Clean) and 03:00 (Start)
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes();
      const seconds = now.getSeconds();

      // At exactly 00:00:00, we reset the completion status
      if (hours === 0 && minutes === 0 && seconds === 0) {
        redTasks.forEach(t => {
           if (t.completed) {
             updateTask(t.id, { completed: false, completed_at: undefined });
           }
        });
      }
      
      // At 03:00:00, the "Operational Day" begins - can be used for notifications/triggers
      if (hours === 3 && minutes === 0 && seconds === 0) {
        console.log("Focus Lab: Novo ciclo operacional iniciado às 03:00.");
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [redTasks, updateTask]);

  // Inject Font
  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700;800&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    return () => { document.head.removeChild(link); };
  }, []);

  // Show loading screen while checking auth
  if (isCheckingAuth) {
    return (
      <div className="h-screen w-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-red-900 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-zinc-400 text-sm font-montserrat">Verificando autenticação...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) return (
    <>
      <Toaster richColors position="top-center" theme="dark" />
      <AuthScreen onLogin={(email) => {
        setIsAuthenticated(true);
        if (email) setCurrentUserEmail(email);
      }} />
    </>
  );

  return (
    <div className="h-screen w-screen bg-black overflow-hidden font-montserrat text-zinc-200 selection:bg-red-900 selection:text-white flex relative">
      <Toaster richColors position="top-center" theme="dark" />
      {/* Global Background for visual consistency - Deep Red Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-zinc-950 to-red-950 pointer-events-none" />
      <div className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(circle_at_50%_50%,_#3f3f46_1px,_transparent_1px)] bg-[size:24px_24px]" />

      <Sidebar currentView={view} setView={setView} />
      
      <main className="flex-1 h-full relative overflow-hidden z-10">
        <AnimatePresence mode="wait">
           {view === 'command_center' && (
             <motion.div key="cmd" className="h-full" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}>
               <CommandCenterView 
                 setView={setView} 
                 focusObjective={objective?.title || ""} 
                 setFocusObjective={(title) => {
                   if (objective) {
                     updateObjective({ title });
                   } else {
                     createObjective({ 
                       title, 
                       target_date: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                       quarter: 'Q1'
                     });
                   }
                 }} 
                 focusTargetDate={objective?.target_date || new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
                 redTasks={redTasks}
                 isOwner={currentUserEmail?.toLowerCase() === 'cadecandidomartins@gmail.com'}
               />
             </motion.div>
           )}
           {view === 'red' && (
             <motion.div key="red" className="h-full" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}>
               <RedViewReal 
                 tasks={redTasks}
                 tasksLoading={tasksLoading}
                 addTask={addTask}
                 toggleTask={toggleTask}
                 removeTask={removeTask}
                 updateTask={updateTask}
                 objective={objective}
                 objectiveLoading={objectiveLoading}
                 updateObjective={updateObjective}
                 createObjective={createObjective}
                 userId={currentUserId}
               />
             </motion.div>
           )}
           {view === 'tasks' && <motion.div key="tsk" className="h-full" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}><TasksView /></motion.div>}
           {view === 'challenges' && <motion.div key="chal" className="h-full" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}><ChallengesView /></motion.div>}
           {view === 'weekly_goals' && <motion.div key="week" className="h-full" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}><WeeklyGoalsView redTasks={redTasks} /></motion.div>}
           {view === 'laboratory' && <motion.div key="lab" className="h-full" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}><LaboratoryView /></motion.div>}
           {view === 'decoupling' && <motion.div key="decoupling" className="h-full" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}><DecouplingView setView={setView} /></motion.div>}
           {view === 'library' && <motion.div key="lib" className="h-full" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}><LibraryView /></motion.div>}
           {view === 'journal' && <motion.div key="journal" className="h-full" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}><JournalView /></motion.div>}
           {view === 'coworking' && <motion.div key="cowork" className="h-full" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}><CoworkingView /></motion.div>}
           
           {view === 'journey' && (
               <motion.div key="journey" className="h-full" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}>
                   <JourneyView />
               </motion.div>
           )}
           
           {view === 'settings' && (
               <motion.div key="settings" className="h-full" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}>
                   <SettingsView />
               </motion.div>
           )}
        </AnimatePresence>
      </main>
    </div>
  );
}