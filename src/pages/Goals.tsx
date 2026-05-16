import React, { useEffect, useMemo, useState } from 'react';
import {
  AlertTriangle,
  CalendarDays,
  Coins,
  Edit3,
  Fuel,
  Lightbulb,
  PiggyBank,
  Plane,
  Plus,
  Search,
  Shield,
  ShoppingCart,
  Star,
  Target,
  Trash2,
  X,
} from 'lucide-react';
import api from '../api/axios';
import Alert from '../components/ui/Alert';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import { goalService } from '../services/goalService';
import type { Goal, GoalPayload, GoalSummary } from '../services/goalService';
import { getLoggedUser } from '../utils/auth';

type Category = { id: number; name: string };
type Location = { id: number; name: string };

type FormState = {
  name: string;
  description: string;
  type: number;
  scope: number;
  period: number;
  targetAmount: string;
  savedAmount: string;
  categoryId: string;
  locationId: string;
  startDate: string;
  endDate: string;
  alertPercentage: string;
  isActive: boolean;
};

const today = () => new Date().toISOString().slice(0, 10);
const endOfMonth = () => {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().slice(0, 10);
};

const emptyForm = (): FormState => ({
  name: '',
  description: '',
  type: 1,
  scope: 0,
  period: 1,
  targetAmount: '',
  savedAmount: '0',
  categoryId: '',
  locationId: '',
  startDate: today(),
  endDate: endOfMonth(),
  alertPercentage: '80',
  isActive: true,
});

const getApiError = (error: any, fallback: string) => {
  const data = error?.response?.data;
  return data?.details || data?.error || data?.message || fallback;
};

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

const Goals: React.FC = () => {
  const user = getLoggedUser();
  const userId = user?.id;
  const currency = user?.currencySymbol || '€';

  const [goals, setGoals] = useState<Goal[]>([]);
  const [summary, setSummary] = useState<GoalSummary | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [orderBy, setOrderBy] = useState('closest');
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm());
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const money = (value?: number) =>
    `${currency} ${(Number(value) || 0).toLocaleString('pt-PT', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  const showSuccess = (message: string) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const showError = (message: string) => {
    setErrorMessage(message);
    setTimeout(() => setErrorMessage(''), 6000);
  };

  const loadGoals = async () => {
    if (!userId) return;
    try {
      setLoading(true);
      const [goalsData, summaryData] = await Promise.all([
        goalService.list(userId, { search, type: typeFilter, orderBy }),
        goalService.summary(userId),
      ]);
      setGoals(goalsData ?? []);
      setSummary(summaryData);
    } catch (error: any) {
      showError(getApiError(error, 'Erro ao carregar metas.'));
    } finally {
      setLoading(false);
    }
  };

  const loadSupportData = async () => {
    if (!userId) return;
    try {
      const [categoriesResponse, locationsResponse] = await Promise.all([
        api.get(`/categories/${userId}`),
        api.get(`/locations/${userId}`),
      ]);
      setCategories(categoriesResponse.data ?? []);
      setLocations(locationsResponse.data ?? []);
    } catch {
      // Mantem a tela funcional mesmo se um select auxiliar falhar.
    }
  };

  useEffect(() => {
    loadSupportData();
  }, [userId]);

  useEffect(() => {
    const timer = setTimeout(loadGoals, 250);
    return () => clearTimeout(timer);
  }, [userId, search, typeFilter, orderBy]);

  const openCreate = () => {
    setEditingGoal(null);
    setForm(emptyForm());
    setModalOpen(true);
  };

  const openEdit = (goal: Goal) => {
    setEditingGoal(goal);
    setForm({
      name: goal.name,
      description: goal.description || '',
      type: goal.type,
      scope: goal.scope,
      period: goal.period,
      targetAmount: String(goal.targetAmount),
      savedAmount: String(goal.type === 0 ? goal.currentAmount : 0),
      categoryId: goal.categoryId ? String(goal.categoryId) : '',
      locationId: goal.locationId ? String(goal.locationId) : '',
      startDate: goal.startDate?.slice(0, 10) || today(),
      endDate: goal.endDate?.slice(0, 10) || '',
      alertPercentage: String(goal.alertPercentage || 80),
      isActive: goal.isActive,
    });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingGoal(null);
    setForm(emptyForm());
  };

  const formPayload = (): GoalPayload | null => {
    if (!userId) return null;
    if (!form.name.trim()) {
      showError('Informe o nome da meta.');
      return null;
    }

    const targetAmount = Number(String(form.targetAmount).replace(',', '.'));
    if (!targetAmount || targetAmount <= 0) {
      showError('Informe um valor de meta válido.');
      return null;
    }

    return {
      name: form.name.trim(),
      description: form.description.trim() || null,
      userId,
      type: Number(form.type),
      scope: Number(form.scope),
      period: Number(form.period),
      targetAmount,
      savedAmount: Number(String(form.savedAmount || '0').replace(',', '.')) || 0,
      categoryId: form.scope === 1 && form.categoryId ? Number(form.categoryId) : null,
      locationId: form.scope === 2 && form.locationId ? Number(form.locationId) : null,
      startDate: form.startDate || today(),
      endDate: form.endDate || null,
      alertPercentage: Number(form.alertPercentage) || 80,
      isActive: form.isActive,
    };
  };

  const saveGoal = async () => {
    const payload = formPayload();
    if (!payload) return;
    try {
      if (editingGoal) {
        await goalService.update(editingGoal.id, payload);
        showSuccess('Meta atualizada com sucesso!');
      } else {
        await goalService.create(payload);
        showSuccess('Meta criada com sucesso!');
      }
      closeModal();
      await loadGoals();
    } catch (error: any) {
      showError(getApiError(error, 'Erro ao salvar meta.'));
    }
  };

  const deleteGoal = async (id: number) => {
    try {
      await goalService.remove(id);
      showSuccess('Meta excluída com sucesso!');
      setDeleteId(null);
      await loadGoals();
    } catch (error: any) {
      showError(getApiError(error, 'Erro ao excluir meta.'));
    }
  };

  const toggleFavorite = async (goal: Goal) => {
    try {
      await goalService.toggleFavorite(goal.id);
      await loadGoals();
    } catch (error: any) {
      showError(getApiError(error, 'Erro ao favoritar meta.'));
    }
  };

  const riskGoals = summary?.riskGoalsList ?? [];
  const upcomingGoals = summary?.upcomingGoals ?? [];

  const projectedPercent = useMemo(() => {
    const spending = summary?.projectedMonthlySpending ?? 0;
    const limits = summary?.definedLimits ?? 0;
    if (limits <= 0) return 0;
    return clamp((spending / limits) * 100, 0, 100);
  }, [summary]);

  return (
    <div className="mx-auto max-w-[1500px] space-y-5 px-2 pb-24 sm:px-4 lg:px-0 lg:pb-8">
      {successMessage && <Alert message={successMessage} variant="success" />}
      {errorMessage && <Alert message={errorMessage} variant="error" />}

      <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h1 className="text-3xl font-black tracking-tight sm:text-4xl">Metas</h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-400 sm:text-base">
            Defina limites, acompanhe sua evolução e evite surpresas no orçamento.
          </p>
        </div>
        <button
          onClick={openCreate}
          className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-600 to-blue-600 px-6 font-bold shadow-xl shadow-violet-950/30 transition hover:scale-[1.01] sm:w-auto"
        >
          <Plus size={20} /> Nova meta
        </button>
      </header>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard icon={Target} title="Metas ativas" value={String(summary?.activeGoals ?? 0)} subtitle="acompanhando agora" tone="violet" />
        <MetricCard icon={PiggyBank} title="Economia planejada" value={money(summary?.plannedSavings)} subtitle="para todas as metas" tone="emerald" />
        <MetricCard icon={Coins} title="Já economizado" value={money(summary?.savedAmount)} subtitle={`${summary?.plannedSavings ? Math.round(((summary?.savedAmount ?? 0) / summary.plannedSavings) * 100) : 0}% do total planejado`} tone="blue" />
        <MetricCard icon={AlertTriangle} title="Metas em risco" value={String(summary?.riskGoals ?? 0)} subtitle="precisam de atenção" tone="orange" />
      </section>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_300px]">
        <main className="space-y-4">
          <section className="rounded-3xl border border-white/10 bg-[#0a1425]/80 p-3 shadow-2xl shadow-black/10 sm:p-4">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div className="relative min-w-0 flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Buscar metas..."
                  className="h-12 w-full rounded-2xl border border-white/10 bg-white/[0.04] pl-11 pr-4 text-sm outline-none transition focus:border-violet-500/70"
                />
              </div>

              <div className="flex gap-2 overflow-x-auto pb-1 lg:pb-0">
                {[
                  ['all', 'Todas'],
                  ['savings', 'Economia'],
                  ['limits', 'Limites'],
                  ['completed', 'Concluídas'],
                ].map(([key, label]) => (
                  <button
                    key={key}
                    onClick={() => setTypeFilter(key)}
                    className={`h-11 shrink-0 rounded-xl px-5 text-sm font-bold transition ${typeFilter === key ? 'bg-violet-600 text-white shadow-lg shadow-violet-900/30' : 'border border-white/10 bg-white/[0.03] text-slate-300 hover:bg-white/[0.06]'}`}
                  >
                    {label}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2 text-sm text-slate-400">
                <span className="hidden sm:inline">Ordenar por:</span>
                <select
                  value={orderBy}
                  onChange={(e) => setOrderBy(e.target.value)}
                  className="h-11 w-full rounded-xl border border-white/10 bg-[#0b1526] px-4 font-semibold text-white outline-none sm:w-auto"
                >
                  <option value="closest">Mais próximas</option>
                  <option value="risk">Maior risco</option>
                  <option value="progress">Progresso</option>
                  <option value="amount">Maior valor</option>
                </select>
              </div>
            </div>
          </section>

          {loading ? (
            <EmptyState title="Carregando metas..." description="Buscando informações reais no banco de dados." />
          ) : goals.length === 0 ? (
            <EmptyState title="Nenhuma meta encontrada" description="Crie sua primeira meta para acompanhar limites, economia e projeções." action={openCreate} />
          ) : (
            <section className="space-y-3">
              {goals.map((goal) => (
                <GoalCard
                  key={goal.id}
                  goal={goal}
                  money={money}
                  onEdit={() => openEdit(goal)}
                  onDelete={() => setDeleteId(goal.id)}
                  onFavorite={() => toggleFavorite(goal)}
                />
              ))}
            </section>
          )}

          <section className="rounded-3xl border border-white/10 bg-[#0a1425]/80 p-5 shadow-2xl shadow-black/10 sm:p-6">
            <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_260px] lg:items-center">
              <div>
                <h2 className="text-xl font-black">Projeção do mês</h2>
                <p className="mt-1 text-sm text-slate-400">Estimativa de gastos até o fim do mês vs. seus limites</p>
                <div className="mt-5 grid gap-2 text-sm sm:grid-cols-2">
                  <div className="flex items-center justify-between gap-3 rounded-2xl bg-white/[0.03] px-4 py-3">
                    <span className="flex items-center gap-2 text-slate-300"><span className="h-3 w-3 rounded-full bg-violet-500" /> Gasto projetado</span>
                    <strong>{money(summary?.projectedMonthlySpending)}</strong>
                  </div>
                  <div className="flex items-center justify-between gap-3 rounded-2xl bg-white/[0.03] px-4 py-3">
                    <span className="flex items-center gap-2 text-slate-300"><span className="h-3 w-3 rounded-full bg-slate-500" /> Limites definidos</span>
                    <strong>{money(summary?.definedLimits)}</strong>
                  </div>
                </div>
                <div className="mt-5">
                  <div className="mb-2 flex items-center justify-between text-xs text-slate-500">
                    <span>{money(0)}</span>
                    <span className="rounded-full bg-emerald-500/15 px-3 py-1 font-bold text-emerald-300">Dentro do limite</span>
                    <span>{money(Math.max(summary?.definedLimits ?? 0, 800))}</span>
                  </div>
                  <div className="h-4 overflow-hidden rounded-full bg-slate-800">
                    <div className="h-full rounded-full bg-gradient-to-r from-violet-600 to-blue-500" style={{ width: `${projectedPercent}%` }} />
                  </div>
                </div>
              </div>
              <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5">
                <div className="mb-3 grid h-12 w-12 place-items-center rounded-2xl bg-violet-500/15 text-violet-300">
                  <Lightbulb />
                </div>
                <p className="text-sm leading-6 text-slate-300">
                  Seus gastos permanecem dentro dos limites definidos. Continue assim!
                </p>
              </div>
            </div>
          </section>
        </main>

        <aside className="space-y-4">
          <InsightCard title="Metas em risco" icon={AlertTriangle}>
            {riskGoals.length === 0 ? (
              <p className="text-sm text-slate-400">Nenhuma meta em risco no momento.</p>
            ) : (
              <div className="space-y-4">
                {riskGoals.map((goal) => (
                  <div key={goal.id} className="flex gap-3">
                    <IconBubble goal={goal} small />
                    <div>
                      <p className="font-semibold">{goal.name}</p>
                      <p className="text-sm font-bold text-orange-300">{goal.progressPercentage}% utilizado</p>
                      <p className="text-sm text-slate-400">Resta {money(goal.remainingAmount)}</p>
                    </div>
                  </div>
                ))}
                <button className="text-sm font-bold text-violet-400">Ver todas em risco →</button>
              </div>
            )}
          </InsightCard>

          <InsightCard title="Próximos vencimentos" icon={CalendarDays}>
            {upcomingGoals.length === 0 ? (
              <p className="text-sm text-slate-400">Nenhum prazo cadastrado.</p>
            ) : (
              <div className="space-y-4">
                {upcomingGoals.map((goal) => (
                  <div key={goal.id} className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-semibold">{goal.name}</p>
                      <p className="text-sm text-slate-400">{goal.endDate ? new Date(goal.endDate).toLocaleDateString('pt-PT') : 'Sem prazo'}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-black">{goal.daysRemaining ?? '-'}</p>
                      <p className="text-xs text-slate-400">dias</p>
                    </div>
                  </div>
                ))}
                <button className="text-sm font-bold text-violet-400">Ver calendário completo →</button>
              </div>
            )}
          </InsightCard>

          <InsightCard title="Dica para você" icon={Lightbulb}>
            <p className="text-sm leading-6 text-slate-300">
              Acompanhe metas acima de 80% com atenção. Se o ritmo continuar, você pode ultrapassar o limite antes do fim do mês.
            </p>
            <button className="mt-4 text-sm font-bold text-violet-400">Ver todas as dicas →</button>
          </InsightCard>
        </aside>
      </div>

      {modalOpen && (
        <GoalModal
          form={form}
          setForm={setForm}
          categories={categories}
          locations={locations}
          editing={!!editingGoal}
          onClose={closeModal}
          onSave={saveGoal}
        />
      )}

      <ConfirmDialog
        open={deleteId !== null}
        title="Excluir meta"
        message="Tem certeza que deseja excluir esta meta? Essa ação não apaga suas compras ou gastos."
        onCancel={() => setDeleteId(null)}
        onConfirm={() => { if (deleteId) deleteGoal(deleteId); }}
      />
    </div>
  );
};

const MetricCard = ({ icon: Icon, title, value, subtitle, tone }: { icon: any; title: string; value: string; subtitle: string; tone: 'violet' | 'emerald' | 'blue' | 'orange' }) => {
  const tones = {
    violet: 'bg-violet-500/15 text-violet-300',
    emerald: 'bg-emerald-500/15 text-emerald-300',
    blue: 'bg-blue-500/15 text-blue-300',
    orange: 'bg-orange-500/15 text-orange-300',
  };
  return (
    <div className="rounded-3xl border border-white/10 bg-[#0a1425]/80 p-5 shadow-2xl shadow-black/10">
      <div className={`mb-4 grid h-14 w-14 place-items-center rounded-2xl ${tones[tone]}`}><Icon size={26} /></div>
      <p className="text-sm text-slate-400">{title}</p>
      <p className="mt-1 text-2xl font-black">{value}</p>
      <p className="mt-1 text-xs font-semibold text-slate-400">↗ {subtitle}</p>
    </div>
  );
};

const IconBubble = ({ goal, small = false }: { goal: Goal; small?: boolean }) => {
  const Icon = goal.name.toLowerCase().includes('combust') ? Fuel : goal.name.toLowerCase().includes('viagem') ? Plane : goal.type === 0 ? Shield : ShoppingCart;
  const tone = goal.type === 0 ? 'bg-violet-500/15 text-violet-300' : goal.name.toLowerCase().includes('combust') ? 'bg-orange-500/15 text-orange-300' : 'bg-emerald-500/15 text-emerald-300';
  return <div className={`grid shrink-0 place-items-center rounded-2xl ${tone} ${small ? 'h-11 w-11' : 'h-16 w-16'}`}><Icon size={small ? 20 : 30} /></div>;
};

const GoalCard = ({ goal, money, onEdit, onDelete, onFavorite }: { goal: Goal; money: (v?: number) => string; onEdit: () => void; onDelete: () => void; onFavorite: () => void }) => {
  const progress = clamp(goal.progressPercentage, 0, 100);
  const statusClass = goal.riskLevel >= 2 ? 'bg-orange-500/15 text-orange-300 border-orange-500/20' : goal.statusKey === 'completed' ? 'bg-violet-500/15 text-violet-300 border-violet-500/20' : goal.statusKey === 'starting' ? 'bg-blue-500/15 text-blue-300 border-blue-500/20' : 'bg-emerald-500/15 text-emerald-300 border-emerald-500/20';

  return (
    <article className="rounded-3xl border border-white/10 bg-[#0a1425]/80 p-4 shadow-xl shadow-black/10 transition hover:border-violet-500/40 sm:p-5">
      <div className="grid gap-4 xl:grid-cols-[minmax(260px,1fr)_minmax(360px,1.6fr)_160px_150px] xl:items-center">
        <div className="flex items-center gap-4">
          <IconBubble goal={goal} />
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="truncate text-lg font-black">{goal.name}</h3>
              <button onClick={onFavorite} className={goal.isFavorite ? 'text-amber-400' : 'text-slate-500'}><Star size={17} fill={goal.isFavorite ? 'currentColor' : 'none'} /></button>
            </div>
            <span className={`mt-2 inline-flex rounded-lg px-2 py-1 text-xs font-bold ${goal.type === 0 ? 'bg-violet-500/15 text-violet-300' : 'bg-emerald-500/15 text-emerald-300'}`}>{goal.typeName}</span>
            {(goal.categoryName || goal.locationName) && <p className="mt-2 text-xs text-slate-400">{goal.categoryName || goal.locationName}</p>}
          </div>
        </div>

        <div className="space-y-3">
          <div className="grid grid-cols-3 gap-3 text-sm">
            <Info label={goal.type === 0 ? 'Meta' : 'Limite'} value={money(goal.targetAmount)} />
            <Info label={goal.type === 0 ? 'Atual' : 'Gasto atual'} value={money(goal.currentAmount)} />
            <Info label="Faltam" value={money(goal.remainingAmount)} />
          </div>
          <div className="flex items-center gap-3">
            <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-800">
              <div className="h-full rounded-full bg-gradient-to-r from-violet-600 to-blue-500" style={{ width: `${progress}%` }} />
            </div>
            <span className="w-12 text-right text-sm font-black">{Math.round(goal.progressPercentage)}%</span>
          </div>
        </div>

        <div className="flex items-center gap-3 xl:block">
          <CalendarDays className="text-slate-400" size={18} />
          <div>
            <p className="text-xs text-slate-400">Prazo</p>
            <p className="font-bold">{goal.endDate ? new Date(goal.endDate).toLocaleDateString('pt-PT') : '—'}</p>
            <span className={`mt-2 inline-flex rounded-lg border px-2 py-1 text-xs font-bold ${statusClass}`}>{goal.statusLabel}</span>
          </div>
        </div>

        <div className="grid grid-cols-[1fr_1fr_auto] gap-2 xl:grid-cols-1">
          <button className="rounded-xl border border-white/10 px-4 py-2 text-sm font-bold hover:bg-white/[0.06]">Ver detalhes</button>
          <button onClick={onEdit} className="flex items-center justify-center gap-2 rounded-xl border border-white/10 px-4 py-2 text-sm font-bold text-violet-300 hover:bg-white/[0.06]"><Edit3 size={16} /> Editar</button>
          <button onClick={onDelete} className="grid h-10 w-10 place-items-center rounded-xl border border-red-500/20 text-red-300 hover:bg-red-500/10 xl:w-full"><Trash2 size={16} /></button>
        </div>
      </div>
    </article>
  );
};

const Info = ({ label, value }: { label: string; value: string }) => (
  <div>
    <p className="text-xs text-slate-400">{label}</p>
    <p className="mt-1 font-black">{value}</p>
  </div>
);

const InsightCard = ({ title, icon: Icon, children }: { title: string; icon: any; children: React.ReactNode }) => (
  <section className="rounded-3xl border border-white/10 bg-[#0a1425]/80 p-5 shadow-xl shadow-black/10">
    <div className="mb-4 flex items-center gap-3">
      <div className="grid h-11 w-11 place-items-center rounded-2xl bg-violet-500/15 text-violet-300"><Icon size={20} /></div>
      <h2 className="font-black">{title}</h2>
    </div>
    {children}
  </section>
);

const EmptyState = ({ title, description, action }: { title: string; description: string; action?: () => void }) => (
  <section className="grid min-h-[260px] place-items-center rounded-3xl border border-dashed border-white/10 bg-[#0a1425]/60 p-8 text-center">
    <div>
      <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-2xl bg-violet-500/15 text-violet-300"><Target size={30} /></div>
      <h2 className="text-xl font-black">{title}</h2>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-400">{description}</p>
      {action && <button onClick={action} className="mt-5 rounded-2xl bg-gradient-to-r from-violet-600 to-blue-600 px-6 py-3 font-bold"><Plus className="mr-2 inline" size={18} />Criar meta</button>}
    </div>
  </section>
);

const GoalModal = ({ form, setForm, categories, locations, editing, onClose, onSave }: { form: FormState; setForm: React.Dispatch<React.SetStateAction<FormState>>; categories: Category[]; locations: Location[]; editing: boolean; onClose: () => void; onSave: () => void }) => {
  const update = (key: keyof FormState, value: string | number | boolean) => setForm((prev) => ({ ...prev, [key]: value }));
  return (
    <div className="fixed inset-0 z-[70] flex items-end justify-center bg-black/70 p-0 backdrop-blur-sm sm:items-center sm:p-4">
      <div className="max-h-[92vh] w-full overflow-y-auto rounded-t-3xl border border-white/10 bg-[#081120] p-5 shadow-2xl shadow-black sm:max-w-3xl sm:rounded-3xl sm:p-6">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-black">{editing ? 'Editar meta' : 'Nova meta'}</h2>
            <p className="mt-1 text-sm text-slate-400">Configure limite, economia, período e alertas.</p>
          </div>
          <button onClick={onClose} className="grid h-10 w-10 place-items-center rounded-xl bg-white/[0.06]"><X size={20} /></button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Nome da meta" className="sm:col-span-2"><input value={form.name} onChange={(e) => update('name', e.target.value)} placeholder="Ex: Limite de supermercado" className="field" /></Field>
          <Field label="Tipo"><select value={form.type} onChange={(e) => update('type', Number(e.target.value))} className="field"><option value={0}>Economizar dinheiro</option><option value={1}>Limitar gastos</option></select></Field>
          <Field label="Aplicar em"><select value={form.scope} onChange={(e) => update('scope', Number(e.target.value))} className="field"><option value={0}>Geral</option><option value={1}>Categoria</option><option value={2}>Local/Estabelecimento</option></select></Field>
          {Number(form.scope) === 1 && <Field label="Categoria"><select value={form.categoryId} onChange={(e) => update('categoryId', e.target.value)} className="field"><option value="">Selecione</option>{categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select></Field>}
          {Number(form.scope) === 2 && <Field label="Local"><select value={form.locationId} onChange={(e) => update('locationId', e.target.value)} className="field"><option value="">Selecione</option>{locations.map((l) => <option key={l.id} value={l.id}>{l.name}</option>)}</select></Field>}
          <Field label={Number(form.type) === 0 ? 'Valor da meta' : 'Valor limite'}><input type="number" step="0.01" value={form.targetAmount} onChange={(e) => update('targetAmount', e.target.value)} placeholder="0,00" className="field" /></Field>
          {Number(form.type) === 0 && <Field label="Valor já economizado"><input type="number" step="0.01" value={form.savedAmount} onChange={(e) => update('savedAmount', e.target.value)} placeholder="0,00" className="field" /></Field>}
          <Field label="Período"><select value={form.period} onChange={(e) => update('period', Number(e.target.value))} className="field"><option value={1}>Mensal</option><option value={2}>Semanal</option><option value={0}>Personalizado</option></select></Field>
          <Field label="Alerta em %"><input type="number" value={form.alertPercentage} onChange={(e) => update('alertPercentage', e.target.value)} className="field" /></Field>
          <Field label="Data inicial"><input type="date" value={form.startDate} onChange={(e) => update('startDate', e.target.value)} className="field" /></Field>
          <Field label="Prazo"><input type="date" value={form.endDate} onChange={(e) => update('endDate', e.target.value)} className="field" /></Field>
          <Field label="Descrição" className="sm:col-span-2"><textarea value={form.description} onChange={(e) => update('description', e.target.value)} placeholder="Observações opcionais" className="field min-h-24 resize-none" /></Field>
          <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 sm:col-span-2"><input type="checkbox" checked={form.isActive} onChange={(e) => update('isActive', e.target.checked)} /> Meta ativa</label>
        </div>

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button onClick={onClose} className="rounded-2xl border border-white/10 px-6 py-3 font-bold hover:bg-white/[0.06]">Cancelar</button>
          <button onClick={onSave} className="rounded-2xl bg-gradient-to-r from-violet-600 to-blue-600 px-6 py-3 font-bold shadow-xl shadow-violet-950/30">Salvar meta</button>
        </div>
      </div>
    </div>
  );
};

const Field = ({ label, children, className = '' }: { label: string; children: React.ReactNode; className?: string }) => (
  <label className={`block ${className}`}>
    <span className="mb-2 block text-sm font-bold text-slate-300">{label}</span>
    {children}
  </label>
);

export default Goals;
