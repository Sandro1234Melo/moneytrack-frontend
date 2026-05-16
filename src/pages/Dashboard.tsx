import React, { useEffect, useMemo, useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  BarChart3,
  CalendarDays,
  Grid2X2,
  LineChart as LineIcon,
  Store,
  Wallet,
} from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import api from "../api/axios";
import { getLoggedUser } from "../utils/auth";

type DashboardRankItem = {
  categoryId?: number;
  categoryName?: string;
  locationId?: number | null;
  locationName?: string;
  name?: string;
  value?: number;
  total: number;
  percentage: number;
  purchasesCount?: number;
  itemsCount?: number;
};

type DailyExpense = {
  date: string;
  label: string;
  total: number;
  purchasesCount: number;
};

type DashboardSummary = {
  from: string;
  to: string;
  days: number;
  totalExpense: number;
  monthlyExpense: number;
  totalPurchases: number;
  averagePerPurchase: number;
  averagePerLocation: number;
  averagePerCategory: number;
  previousPeriodTotal: number;
  totalTrendPercent: number;
  forecastNextWeek: number;
  forecastNextMonth: number;
  categoryExpenses: DashboardRankItem[];
  locationExpenses: DashboardRankItem[];
  dailyExpenses: DailyExpense[];
};

type PeriodOption = 7 | 30 | 90;

type StatCardProps = {
  title: string;
  value: string;
  icon: React.ElementType;
  trend: string;
  up?: boolean;
  color: string;
};

const emptySummary: DashboardSummary = {
  from: "",
  to: "",
  days: 30,
  totalExpense: 0,
  monthlyExpense: 0,
  totalPurchases: 0,
  averagePerPurchase: 0,
  averagePerLocation: 0,
  averagePerCategory: 0,
  previousPeriodTotal: 0,
  totalTrendPercent: 0,
  forecastNextWeek: 0,
  forecastNextMonth: 0,
  categoryExpenses: [],
  locationExpenses: [],
  dailyExpenses: [],
};

const toDateInputValue = (date: Date) => date.toISOString().slice(0, 10);

const getRangeByDays = (days: PeriodOption) => {
  const to = new Date();
  const from = new Date();
  from.setDate(to.getDate() - (days - 1));

  return {
    from: toDateInputValue(from),
    to: toDateInputValue(to),
  };
};

const StatCard = ({ title, value, icon: Icon, trend, up = false, color }: StatCardProps) => (
  <div className="rounded-3xl border border-white/10 bg-[#0a1425]/80 p-5 shadow-2xl shadow-black/20 backdrop-blur-xl">
    <div className={`mb-8 grid h-14 w-14 place-items-center rounded-2xl ${color}`}>
      <Icon size={25} />
    </div>
    <p className="min-h-12 text-sm leading-6 text-slate-300 sm:text-base">{title}</p>
    <p className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">{value}</p>
    <p className={`mt-5 flex items-center gap-2 text-sm font-semibold ${up ? "text-rose-400" : "text-emerald-400"}`}>
      {up ? <ArrowUp size={16} /> : <ArrowDown size={16} />} {trend}
    </p>
  </div>
);

const Dashboard: React.FC = () => {
  const user = getLoggedUser();
  const userId = user?.id;
  const currency = user?.currencySymbol || "€";

  const [selectedPeriod, setSelectedPeriod] = useState<PeriodOption>(30);
  const [summary, setSummary] = useState<DashboardSummary>(emptySummary);
  const [loading, setLoading] = useState(true);
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [showAllLocations, setShowAllLocations] = useState(false);

  const range = useMemo(() => getRangeByDays(selectedPeriod), [selectedPeriod]);

  useEffect(() => {
    setShowAllCategories(false);
    setShowAllLocations(false);
  }, [selectedPeriod]);

  useEffect(() => {
    if (!userId) return;

    setLoading(true);
    api
      .get("/reports/dashboard-summary", {
        params: {
          userId,
          from: range.from,
          to: range.to,
        },
      })
      .then((res) => setSummary({ ...emptySummary, ...res.data }))
      .catch((err) => console.error("Erro ao carregar dashboard:", err))
      .finally(() => setLoading(false));
  }, [userId, range.from, range.to]);

  const money = (value: number) =>
    `${currency} ${Number(value || 0).toLocaleString("pt-PT", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  const trend = summary.totalTrendPercent || 0;
  const trendIsUp = trend > 0;
  const trendLabel = `${Math.abs(trend).toLocaleString("pt-PT", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  })}% vs. período anterior`;

  const categoriesToShow = showAllCategories
    ? summary.categoryExpenses
    : summary.categoryExpenses.slice(0, 5);

  const locationsToShow = showAllLocations
    ? summary.locationExpenses
    : summary.locationExpenses.slice(0, 5);

  const chartData = summary.dailyExpenses.map((item) => ({
    ...item,
    total: Number(item.total || 0),
  }));

  return (
    <div className="mx-auto max-w-7xl space-y-7">
      <section className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
        <div>
          <p className="text-lg text-slate-300">Olá, {user?.full_Name?.split(" ")[0] ?? user?.fullName?.split(" ")[0] ?? "Samuel"} 👋</p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight sm:text-4xl">Resumo financeiro</h1>
          <p className="mt-2 flex items-center gap-2 text-sm text-slate-400">
            <CalendarDays size={16} /> {summary.from || range.from} até {summary.to || range.to}
          </p>
        </div>

        <div className="flex w-full gap-2 overflow-x-auto pb-1 lg:w-auto">
          {([7, 30, 90] as PeriodOption[]).map((days) => (
            <button
              key={days}
              type="button"
              onClick={() => setSelectedPeriod(days)}
              className={`whitespace-nowrap rounded-2xl border px-6 py-3 text-sm font-semibold transition ${
                selectedPeriod === days
                  ? "border-violet-500 bg-gradient-to-r from-violet-600 to-blue-600 text-white shadow-lg shadow-violet-700/20"
                  : "border-white/10 bg-white/[0.03] text-slate-300 hover:border-violet-500/50 hover:text-white"
              }`}
            >
              {days} dias
            </button>
          ))}
        </div>
      </section>

      <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          title="Total gasto"
          value={loading ? "..." : money(summary.totalExpense)}
          icon={Wallet}
          trend={trendLabel}
          up={trendIsUp}
          color="bg-emerald-500/15 text-emerald-300"
        />
        <StatCard
          title="Média por estabelecimento"
          value={loading ? "..." : money(summary.averagePerLocation)}
          icon={Store}
          trend={`${summary.locationExpenses.length} estabelecimento(s)`}
          color="bg-blue-500/15 text-blue-300"
        />
        <StatCard
          title="Média por categoria"
          value={loading ? "..." : money(summary.averagePerCategory)}
          icon={Grid2X2}
          trend={`${summary.categoryExpenses.length} categoria(s)`}
          color="bg-violet-500/15 text-violet-300"
        />
        <StatCard
          title="Previsão próximo mês"
          value={loading ? "..." : money(summary.forecastNextMonth)}
          icon={LineIcon}
          trend="com base no histórico"
          color="bg-indigo-500/15 text-indigo-300"
        />
      </section>

      <section className="rounded-3xl border border-white/10 bg-[#0a1425]/80 p-5 shadow-2xl shadow-black/20 lg:p-7">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold">Gastos no período</h2>
            <p className="mt-1 text-sm text-slate-400">Dados reais filtrados pelos últimos {selectedPeriod} dias</p>
          </div>
          <span className="rounded-2xl border border-white/10 px-4 py-2 text-sm text-slate-300">Diário</span>
        </div>

        <div className="h-[310px]">
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="dashboardGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.55} />
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
                <XAxis dataKey="label" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${Number(value).toFixed(0)}`} />
                <Tooltip
                  contentStyle={{ background: "#0f172a", border: "1px solid rgba(255,255,255,.12)", borderRadius: 16, color: "#fff" }}
                  formatter={(value) => [money(Number(value)), "Gasto"]}
                  labelFormatter={(label) => `Dia ${label}`}
                />
                <Area type="monotone" dataKey="total" stroke="#8b5cf6" strokeWidth={3} fill="url(#dashboardGradient)" dot={{ r: 4 }} activeDot={{ r: 7 }} />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="grid h-full place-items-center rounded-2xl border border-dashed border-white/10 text-center text-slate-400">
              Nenhum gasto encontrado para este período.
            </div>
          )}
        </div>
      </section>

      <section className="grid gap-5 lg:grid-cols-2">
        <div className="rounded-3xl border border-white/10 bg-[#0a1425]/80 p-6">
          <div className="mb-6 flex items-center justify-between gap-3">
            <h3 className="text-xl font-bold">Gastos por categoria</h3>
            <span className="text-sm text-slate-400">{summary.categoryExpenses.length} total</span>
          </div>

          {categoriesToShow.length > 0 ? (
            categoriesToShow.map((item) => {
              const percent = Number(item.percentage || 0);
              return (
                <div key={item.categoryId ?? item.name} className="mb-5 grid grid-cols-[1fr_auto] gap-3 text-sm">
                  <span className="truncate font-medium">{item.categoryName || item.name}</span>
                  <span>{percent.toLocaleString("pt-PT", { maximumFractionDigits: 1 })}%</span>
                  <div className="h-2 rounded-full bg-white/5">
                    <div className="h-2 rounded-full bg-gradient-to-r from-cyan-400 to-violet-500" style={{ width: `${Math.min(percent, 100)}%` }} />
                  </div>
                  <span className="text-slate-400">{money(item.total)}</span>
                </div>
              );
            })
          ) : (
            <p className="rounded-2xl border border-dashed border-white/10 p-6 text-center text-slate-400">Nenhuma categoria neste período.</p>
          )}

          {summary.categoryExpenses.length > 5 && (
            <button type="button" onClick={() => setShowAllCategories((prev) => !prev)} className="mt-3 font-semibold text-violet-400 hover:text-violet-300">
              {showAllCategories ? "Mostrar menos" : "Ver todas as categorias"} ›
            </button>
          )}
        </div>

        <div className="rounded-3xl border border-white/10 bg-[#0a1425]/80 p-6">
          <div className="mb-6 flex items-center justify-between gap-3">
            <h3 className="text-xl font-bold">Gastos por estabelecimento</h3>
            <span className="text-sm text-slate-400">{summary.locationExpenses.length} total</span>
          </div>

          {locationsToShow.length > 0 ? (
            locationsToShow.map((item, index) => {
              const percent = Number(item.percentage || 0);
              return (
                <div key={item.locationId ?? item.name ?? index} className="mb-4 flex items-center gap-4">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white/5 text-sm">{index + 1}</span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold">{item.locationName || item.name}</p>
                    <div className="mt-2 h-2 rounded-full bg-white/5">
                      <div className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-cyan-300" style={{ width: `${Math.min(percent, 100)}%` }} />
                    </div>
                  </div>
                  <div className="text-right">
                    <p>{money(item.total)}</p>
                    <p className="text-sm text-emerald-400">{percent.toLocaleString("pt-PT", { maximumFractionDigits: 1 })}%</p>
                  </div>
                </div>
              );
            })
          ) : (
            <p className="rounded-2xl border border-dashed border-white/10 p-6 text-center text-slate-400">Nenhum estabelecimento neste período.</p>
          )}

          {summary.locationExpenses.length > 5 && (
            <button type="button" onClick={() => setShowAllLocations((prev) => !prev)} className="mt-3 font-semibold text-violet-400 hover:text-violet-300">
              {showAllLocations ? "Mostrar menos" : "Ver todos os estabelecimentos"} ›
            </button>
          )}
        </div>
      </section>

      <section className="rounded-3xl border border-white/10 bg-[#0a1425]/80 p-6">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-5">
            <div className="grid h-16 w-16 shrink-0 place-items-center rounded-3xl bg-violet-600/20 text-violet-300">
              <BarChart3 size={30} />
            </div>
            <div>
              <h3 className="text-xl font-bold">Previsão de gastos</h3>
              <p className="text-slate-400">Calculada pela média diária dos seus gastos anteriores.</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-8">
            <div>
              <p className="text-slate-400">Próxima semana</p>
              <p className="text-2xl font-bold">{money(summary.forecastNextWeek)}</p>
            </div>
            <div>
              <p className="text-slate-400">Próximo mês</p>
              <p className="text-2xl font-bold">{money(summary.forecastNextMonth)}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
