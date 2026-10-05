import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  BarChart3,
  Camera,
  Check,
  Cloud,
  Heart,
  ListChecks,
  LockKeyhole,
  Menu,
  ShieldCheck,
  ShoppingCart,
  Smartphone,
  Target,
  TrendingUp,
  X,
  Zap,
} from "lucide-react";

type Feature = {
  title: string;
  description: string;
  details: string;
  icon: typeof BarChart3;
  preview: "chart" | "shopping" | "receipt" | "goal" | "report" | "list";
};

const navItems = [
  { label: "Início", target: "inicio" },
  { label: "Recursos", target: "recursos" },
  { label: "Planos", target: "planos" },
  { label: "Segurança", target: "seguranca" },
  { label: "Blog", target: "blog" },
  { label: "Ajuda", target: "ajuda" },
];

const features: Feature[] = [
  {
    title: "Dashboard financeiro",
    description: "Veja seus ganhos, gastos e saldo de forma clara e visual.",
    details: "Acompanhe receitas, despesas, saldo e a evolução do mês em uma visão simples e objetiva.",
    icon: BarChart3,
    preview: "chart",
  },
  {
    title: "Registro de compras",
    description: "Acompanhe todas as suas compras em um só lugar.",
    details: "Registre cada compra com categoria, valor e forma de pagamento para construir seu histórico.",
    icon: ShoppingCart,
    preview: "shopping",
  },
  {
    title: "Leitura de nota por foto",
    description: "Registre suas compras em segundos com a câmera do celular.",
    details: "Envie uma foto do comprovante e transforme a rotina de registrar compras em poucos toques.",
    icon: Camera,
    preview: "receipt",
  },
  {
    title: "Metas financeiras",
    description: "Defina seus objetivos e acompanhe sua evolução.",
    details: "Crie metas com um valor-alvo e acompanhe visualmente o caminho até a sua conquista.",
    icon: Target,
    preview: "goal",
  },
  {
    title: "Relatórios",
    description: "Entenda seus hábitos com gráficos detalhados.",
    details: "Encontre padrões nos seus gastos e tome decisões financeiras melhores com dados claros.",
    icon: TrendingUp,
    preview: "report",
  },
  {
    title: "Lista de compras",
    description: "Organize sua lista e nunca mais esqueça o que precisa.",
    details: "Crie listas práticas, marque itens concluídos e deixe a próxima compra muito mais organizada.",
    icon: ListChecks,
    preview: "list",
  },
];

function MoneyTrackLogo() {
  return (
    <Link to="#inicio" className="flex shrink-0 items-center gap-2 sm:gap-2.5" aria-label="MoneyTrack: página inicial">
      <span className="flex h-8 w-7 items-end gap-1 text-violet-400 sm:h-9 sm:w-8" aria-hidden="true">
        <i className="h-3 w-2 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,.8)]" />
        <i className="h-6 w-2 rounded-full bg-violet-500 shadow-[0_0_10px_rgba(139,92,246,.9)]" />
        <i className="h-8 w-2 rounded-full bg-violet-400 shadow-[0_0_10px_rgba(167,139,250,.9)]" />
      </span>
      <span className="text-[1.18rem] font-extrabold tracking-[-.045em] text-white sm:text-[1.38rem]">MoneyTrack</span>
    </Link>
  );
}

function FeaturePreview({ type }: { type: Feature["preview"] }) {
  if (type === "chart" || type === "report") {
    const values = type === "chart" ? [39, 58, 46, 75, 91, 64, 80, 52] : [18, 28, 43, 61, 47, 75, 91, 63];

    return (
      <div className="mt-3 h-[84px] rounded-xl border border-blue-300/10 bg-[#081832] px-3 pb-3 pt-4">
        <div className="flex h-full items-end gap-1.5">
          {values.map((value, index) => (
            <span key={index} className="min-w-0 flex-1 rounded-t-sm bg-gradient-to-t from-[#3436ae] via-violet-500 to-blue-400" style={{ height: `${value}%` }} />
          ))}
          {type === "chart" && <span className="ml-1 rounded bg-emerald-500/15 px-1.5 py-1 text-[9px] font-bold text-emerald-300">↑ 12%</span>}
        </div>
      </div>
    );
  }

  if (type === "shopping") {
    return (
      <div className="mt-3 space-y-2 rounded-xl border border-blue-300/10 bg-[#081832] p-3 text-[10px]">
        <div className="flex items-center justify-between"><span className="flex items-center gap-2"><b className="grid h-6 w-6 place-items-center rounded-md bg-orange-500 text-sm">🛒</b>Supermercado</span><strong>R$ 124,90</strong></div>
        <div className="flex items-center justify-between"><span className="flex items-center gap-2"><b className="grid h-6 w-6 place-items-center rounded-md bg-emerald-500 text-sm">⌂</b>Farmácia</span><strong>R$ 56,80</strong></div>
      </div>
    );
  }

  if (type === "receipt") {
    return (
      <div className="relative mt-3 grid h-[100px] place-items-center overflow-hidden rounded-xl border border-blue-300/10 bg-[radial-gradient(circle_at_center,rgba(37,99,235,.2),transparent_62%),#081832]">
        <div className="relative z-10 h-[82px] w-[126px] -rotate-2 rounded-[2px] bg-slate-100 px-3 py-2 font-mono text-[6px] leading-[1.35] text-slate-700 shadow-xl shadow-black/50">
          <div className="text-center font-black tracking-[.08em]">MERCADO CENTRAL</div>
          <div className="text-center text-[5px]">CNPJ 12.345.678/0001-90</div>
          <div className="my-1 border-t border-dashed border-slate-400" />
          <div className="flex justify-between"><span>LEITE INTEGRAL</span><span>5,99</span></div>
          <div className="flex justify-between"><span>PÃO FRANCÊS</span><span>7,90</span></div>
          <div className="flex justify-between"><span>FRUTAS</span><span>12,80</span></div>
          <div className="mt-1 flex justify-between border-t border-dashed border-slate-400 pt-1 text-[7px] font-black"><span>TOTAL</span><span>R$ 26,69</span></div>
          <div className="mt-1 flex h-2 items-stretch gap-px">{[1, 2, 1, 3, 1, 1, 2, 3, 1, 2, 1, 3, 2, 1, 2, 1].map((width, index) => <i key={index} className="bg-slate-800" style={{ width: `${width}px` }} />)}</div>
        </div>
        <span className="absolute left-4 right-4 top-3 z-20 h-px animate-pulse bg-cyan-300 shadow-[0_0_9px_2px_rgba(34,211,238,.85)]" />
        <span className="absolute left-[calc(50%-72px)] top-2 h-5 w-6 border-l-2 border-t-2 border-cyan-300" /><span className="absolute right-[calc(50%-72px)] top-2 h-5 w-6 border-r-2 border-t-2 border-cyan-300" />
        <span className="absolute bottom-2 left-[calc(50%-72px)] h-5 w-6 border-b-2 border-l-2 border-cyan-300" /><span className="absolute bottom-2 right-[calc(50%-72px)] h-5 w-6 border-b-2 border-r-2 border-cyan-300" />
        <span className="absolute bottom-3 right-4 z-30 grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-violet-500 to-blue-500 shadow-lg shadow-violet-900/70"><Camera size={17} /></span>
      </div>
    );
  }

  if (type === "goal") {
    return (
      <div className="mt-3 rounded-xl border border-blue-300/10 bg-[#081832] p-2.5">
        <div className="flex items-center gap-2.5"><img src="/goal-beach.png" alt="Praia tropical" className="h-16 w-14 shrink-0 rounded-md object-cover" /><span><b className="block text-[11px]">Viagem dos sonhos</b><small className="text-[9px] text-slate-400">R$ 3.200 de R$ 8.000</small></span></div>
        <div className="mt-3 flex items-center gap-2"><span className="h-2 flex-1 overflow-hidden rounded-full bg-white/10"><i className="block h-full w-[40%] rounded-full bg-gradient-to-r from-violet-600 to-sky-400" /></span><small className="text-[9px]">40%</small></div>
      </div>
    );
  }

  return (
    <div className="mt-3 space-y-1.5 rounded-xl border border-blue-300/10 bg-[#081832] p-3 text-[10px]">
      {["Leite", "Pão", "Frutas", "Café"].map((item, index) => <div key={item} className="flex items-center gap-2 border-b border-white/10 pb-1 last:border-0"><span className={`grid h-4 w-4 place-items-center rounded border ${index < 2 ? "border-blue-500 bg-blue-500" : "border-slate-500"}`}>{index < 2 && <Check size={10} />}</span>{item}</div>)}
    </div>
  );
}

export default function Landing() {
  const [activeMenu, setActiveMenu] = useState("inicio");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState<Feature | null>(null);

  const selectMenu = (target: string) => {
    setActiveMenu(target);
    setIsMobileMenuOpen(false);
  };

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#030919] text-white">
      <section id="inicio" className="relative min-h-[560px] overflow-hidden border-b border-white/10 bg-[#020919] sm:min-h-[600px] lg:min-h-[650px] 2xl:min-h-[740px]">
        <div className="pointer-events-none absolute inset-y-0 left-[638px] right-0 hidden lg:block xl:left-[614px]">
          <img src="/landing-hero-person.png" alt="" className="h-full w-full object-cover object-center" />
        </div>
        <div className="pointer-events-none absolute inset-0 z-[1] hidden bg-[linear-gradient(90deg,#020919_0px,#020919_638px,rgba(2,9,25,.82)_730px,transparent_920px)] lg:block xl:bg-[linear-gradient(90deg,#020919_0px,#020919_614px,rgba(2,9,25,.82)_706px,transparent_896px)]" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_5%_10%,rgba(83,41,180,.2),transparent_25%),radial-gradient(circle_at_65%_0%,rgba(37,99,235,.1),transparent_26%)]" />

        <header className="relative z-20 border-b border-white/10 lg:border-0">
          <div className="mx-auto flex h-16 max-w-[1880px] items-center justify-between gap-3 px-4 sm:gap-5 sm:px-6 lg:h-[63px] lg:gap-6 lg:px-10">
            <MoneyTrackLogo />
            <nav aria-label="Navegação principal" className="hidden h-full items-center gap-8 lg:flex">
              {navItems.map(({ label, target }) => (
                <a key={target} href={`#${target}`} onClick={() => selectMenu(target)} aria-current={activeMenu === target ? "page" : undefined} className={`relative flex h-full items-center text-sm font-medium transition ${activeMenu === target ? "text-violet-300 after:absolute after:bottom-[13px] after:left-0 after:h-0.5 after:w-full after:rounded-full after:bg-violet-400" : "text-slate-200 hover:text-violet-200"}`}>{label}</a>
              ))}
            </nav>
            <div className="hidden shrink-0 items-center gap-3 text-sm font-semibold lg:flex">
              <Link to="/login" className="rounded-xl border border-sky-400/80 px-6 py-2.5 transition hover:bg-sky-400/10">Entrar</Link>
              <Link to="/register" className="rounded-xl bg-gradient-to-r from-violet-600 to-blue-500 px-6 py-2.5 shadow-lg shadow-violet-950/50 transition hover:brightness-110">Criar conta grátis</Link>
            </div>
            <button type="button" onClick={() => setIsMobileMenuOpen((isOpen) => !isOpen)} className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-violet-300/30 text-violet-200 transition hover:bg-violet-400/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-300 lg:hidden" aria-label={isMobileMenuOpen ? "Fechar menu" : "Abrir menu"} aria-controls="mobile-navigation" aria-expanded={isMobileMenuOpen}>{isMobileMenuOpen ? <X size={22} /> : <Menu size={23} />}</button>
          </div>
          {isMobileMenuOpen && <div id="mobile-navigation" className="border-t border-white/10 bg-[#06142a]/95 px-4 py-4 backdrop-blur sm:px-6 lg:hidden"><nav aria-label="Navegação mobile" className="grid gap-1">{navItems.map(({ label, target }) => <a key={target} href={`#${target}`} onClick={() => selectMenu(target)} aria-current={activeMenu === target ? "page" : undefined} className={`rounded-lg px-3 py-3 text-sm font-semibold transition ${activeMenu === target ? "bg-violet-400/15 text-violet-200" : "text-slate-200 hover:bg-white/5 hover:text-violet-200"}`}>{label}</a>)}</nav><div className="mt-4 grid gap-3 border-t border-white/10 pt-4"><Link to="/register" className="rounded-xl bg-gradient-to-r from-violet-600 to-blue-500 px-5 py-3 text-center text-sm font-bold shadow-lg shadow-violet-950/50">Criar conta grátis</Link><Link to="/login" className="rounded-xl border border-sky-400/80 px-5 py-3 text-center text-sm font-bold">Entrar</Link></div></div>}
        </header>

        <div className="relative z-10 mx-auto max-w-[1880px] px-4 pb-10 pt-8 sm:px-6 sm:pb-12 lg:px-10 lg:pb-7 lg:pt-7">
          <div className="max-w-[530px]">
            <p className="inline-flex rounded-full border border-violet-400/35 bg-violet-500/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[.13em] text-violet-300">Sua vida financeira mais simples</p>
            <h1 className="mt-4 text-[2.15rem] font-black leading-[.98] tracking-[-.045em] min-[390px]:text-[2.65rem] sm:text-[3.55rem]"><span>Controle seus gastos,</span><br /><span className="bg-gradient-to-r from-fuchsia-400 via-violet-400 to-cyan-300 bg-clip-text text-transparent drop-shadow-[0_0_10px_rgba(168,85,247,0.75)]">compras e metas</span><br />em um <span className="bg-gradient-to-r from-fuchsia-400 via-violet-400 to-cyan-300 bg-clip-text text-transparent drop-shadow-[0_0_10px_rgba(168,85,247,0.75)]">só lugar.</span></h1>
            <p className="mt-4 max-w-[505px] text-[15px] leading-[1.5] text-slate-200 sm:text-[16px] sm:leading-[1.38]">O <b className="text-white">MoneyTrack</b> ajuda você a gerenciar suas despesas, acompanhar suas compras, definir e conquistar metas financeiras e organizar sua lista de compras, de forma simples, rápida e inteligente.</p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link to="/register" className="inline-flex items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-violet-600 to-blue-500 px-8 py-3 font-bold shadow-xl shadow-violet-950/60 transition hover:brightness-110 sm:justify-start sm:py-2.5">Criar conta grátis <ArrowRight size={18} /></Link>
              <Link to="/login" className="inline-flex items-center justify-center rounded-xl border border-sky-400/80 bg-[#020817]/70 px-9 py-3 font-bold transition hover:bg-sky-400/10 sm:py-2.5">Entrar</Link>
            </div>
            <div className="mt-8 grid max-w-[530px] grid-cols-1 gap-4 min-[480px]:grid-cols-3 min-[480px]:gap-5">
              {[[BarChart3, "Organize", "suas finanças"], [Zap, "Conquiste", "seus objetivos"], [Heart, "Mais controle", "para o seu dia a dia"]].map(([Icon, title, description]) => {
                const StatIcon = Icon as typeof BarChart3;
                return <div key={title as string} className="flex items-center gap-3"><span className="grid h-[46px] w-[46px] shrink-0 place-items-center rounded-full border border-violet-400/80 text-violet-300"><StatIcon size={24} /></span><span className="text-[15.4px] leading-[1.35] text-slate-300"><b className="block text-white">{title as string}</b>{description as string}</span></div>;
              })}
            </div>
          </div>
        </div>
      </section>

      <section id="recursos" className="scroll-mt-2 bg-[radial-gradient(circle_at_72%_50%,rgba(91,33,182,.22),transparent_31%),#030919] px-4 py-10 sm:px-6 sm:py-12 lg:px-10">
        <div className="mx-auto max-w-[1880px]">
          <div className="grid gap-5 lg:grid-cols-[1fr_365px] lg:items-end">
            <div><p className="text-[12px] font-bold uppercase tracking-[.13em] text-blue-400">Tudo o que você precisa</p><h2 className="mt-1 text-3xl font-black leading-tight tracking-[-.04em] sm:text-[2.4rem]">Recursos feitos para a <span className="bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent">sua vida real</span></h2></div>
            <p className="pb-1 text-sm leading-5 text-slate-300">Do controle diário às grandes conquistas. O MoneyTrack reúne tudo o que você precisa para ter uma vida financeira mais organizada e tranquila.</p>
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
            {features.map((feature) => {
              const Icon = feature.icon;
              return <button type="button" key={feature.title} onClick={() => setSelectedFeature(feature)} className="rounded-xl border border-violet-300/20 bg-[linear-gradient(180deg,rgba(139,92,246,.3)_0%,rgba(10,26,53,.96)_38%,rgba(10,26,53,.96)_100%)] p-4 text-left shadow-lg shadow-black/20 transition hover:-translate-y-1 hover:border-violet-400/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-300"><div className="flex items-start gap-3"><span className="flex h-12 w-12 shrink-0 items-center justify-center text-violet-300"><Icon size={28} /></span><h3 className="pt-1 text-lg font-bold leading-tight">{feature.title}</h3></div><p className="mt-3 min-h-[65px] text-base leading-[1.35] text-slate-300">{feature.description}</p><FeaturePreview type={feature.preview} /></button>;
            })}
          </div>
        </div>
      </section>

      <section id="planos" className="scroll-mt-2 bg-[radial-gradient(circle_at_72%_50%,rgba(91,33,182,.22),transparent_31%),#030919] px-4 py-12 sm:px-6 sm:py-14 lg:px-10">
        <div className="mx-auto grid max-w-[1880px] gap-8 lg:grid-cols-[.85fr_1fr_1.15fr] lg:items-center">
          <div><p className="text-sm font-bold uppercase tracking-[.2em] text-violet-300">Planos</p><h2 className="mt-3 max-w-md text-4xl font-black leading-[1.05] sm:text-5xl">Comece <span className="text-blue-400">grátis</span> e tenha mais <span className="text-violet-400">controle</span></h2><p className="mt-4 max-w-sm text-base leading-7 text-slate-300 sm:text-lg">Use o MoneyTrack para organizar seus gastos, compras e metas financeiras sem custo inicial.</p></div>
          <article className="rounded-2xl border border-violet-400/45 bg-[linear-gradient(135deg,rgba(91,33,182,.24),rgba(7,16,37,.94))] p-5 shadow-xl shadow-violet-950/30 sm:p-6"><div className="flex flex-col gap-3 min-[420px]:flex-row min-[420px]:items-center min-[420px]:justify-between"><h3 className="text-2xl font-bold">Conta gratuita</h3><span className="w-fit rounded-full bg-emerald-400/15 px-3 py-1 text-sm font-bold text-emerald-300">100% gratuita</span></div><div className="mt-5 grid grid-cols-1 gap-x-4 gap-y-3 text-base text-slate-200 sm:grid-cols-2">{["Registro de compras", "Metas financeiras", "Dashboard financeiro", "Relatórios básicos", "Lista de compras", "Acesso em qualquer dispositivo"].map((item) => <span key={item} className="flex gap-2"><Check size={18} className="mt-0.5 shrink-0 text-emerald-400" />{item}</span>)}</div></article>
          <div className="relative hidden min-h-52 lg:block"><span aria-hidden="true" className="absolute inset-8 bg-violet-500/30 blur-3xl" /><img src="/Dashboard financeiro MoneyTrack em dispositivos.png" alt="MoneyTrack em vários dispositivos" className="relative z-10 h-60 w-full object-contain" /></div>
        </div>
      </section>

      <section id="seguranca" className="scroll-mt-2 bg-[radial-gradient(circle_at_88%_60%,rgba(63,47,176,.32),transparent_25%),#051126] px-4 py-12 sm:px-6 lg:px-10">
        <div className="mx-auto grid max-w-[1880px] gap-8 lg:grid-cols-[.9fr_1.7fr_.8fr] lg:items-center">
          <div><p className="text-xs font-bold uppercase tracking-[.2em] text-violet-300">Segurança</p><h2 className="mt-3 text-3xl font-black leading-tight sm:text-4xl">Seguro, confiável<br />e sempre com você</h2><p className="mt-3 max-w-sm text-sm leading-5 text-slate-300 sm:text-base">Seus dados são protegidos com criptografia de ponta a ponta. Acesse o MoneyTrack em todos os seus dispositivos com total segurança.</p></div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">{[[ShieldCheck, "Seus dados", "protegidos"], [LockKeyhole, "Acesso com", "login e senha"], [Cloud, "Backup", "automático"], [Smartphone, "Acesso no celular,", "computador e tablet"], [TrendingUp, "Sincronização", "em tempo real"]].map(([Icon, firstLine, secondLine]) => { const SafetyIcon = Icon as typeof ShieldCheck; return <div key={firstLine as string} className="text-center"><span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-violet-500/10 text-violet-300 ring-1 ring-violet-300/15"><SafetyIcon size={27} /></span><p className="mt-3 text-xs font-medium leading-4 text-slate-200">{firstLine as string}<br />{secondLine as string}</p></div>; })}</div>
          <div className="relative mx-auto hidden h-36 w-40 lg:block"><span aria-hidden="true" className="absolute inset-0 rounded-full bg-violet-500/45 blur-3xl" /><ShieldCheck className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 text-violet-200 drop-shadow-[0_0_22px_rgba(139,92,246,.9)]" size={110} strokeWidth={1.2} /></div>
        </div>
      </section>

      <section id="blog" className="scroll-mt-2 bg-[radial-gradient(circle_at_72%_50%,rgba(91,33,182,.22),transparent_31%),#030919] px-4 py-12 sm:px-6 lg:px-10"><div className="mx-auto grid max-w-[1880px] gap-6 lg:grid-cols-[320px_1fr] lg:items-center"><div className="text-left"><p className="text-xs font-bold uppercase tracking-[.2em] text-blue-300">Blog</p><h2 className="mt-2 text-3xl font-black sm:text-4xl">Conteúdo para cuidar melhor do seu dinheiro</h2><p className="mt-3 text-sm leading-5 text-slate-300 sm:text-base">Dicas, tutoriais e ideias para você organizar sua vida financeira.</p></div><div className="grid gap-4 lg:grid-cols-3">{[["Como organizar os gastos do mês", "Dicas práticas para transformar planejamento em hábito.", "/blog-cesta-supermercado.png"], ["Metas financeiras realistas", "Aprenda a definir objetivos e acompanhar sua evolução.", "/blog-cofrinho.png"], ["Como economizar no supermercado", "Estratégias simples para gastar menos e comprar melhor.", "/blog-carrinho-supermercado.png"]].map(([title, description, image]) => <article key={title} className="flex flex-col overflow-hidden rounded-xl border border-white/10 bg-[#0a1a35] sm:flex-row"><img src={image} alt="" loading="lazy" className="m-2 h-44 w-[calc(100%-1rem)] rounded-lg object-cover sm:h-auto sm:w-28 sm:shrink-0" /><div className="p-4 pt-1 sm:px-0 sm:py-4 sm:pr-4"><h3 className="font-bold leading-5">{title}</h3><p className="mt-2 text-sm leading-5 text-slate-300">{description}</p><button type="button" className="mt-3 text-sm font-semibold text-violet-300">Ler artigo <ArrowRight className="inline" size={14} /></button></div></article>)}</div></div></section>

      <section id="ajuda" className="scroll-mt-2 bg-[#030919] px-4 py-12 sm:px-6 lg:px-10"><div className="mx-auto max-w-[1880px]"><p className="text-xs font-bold uppercase tracking-[.2em] text-violet-300">Ajuda</p><h2 className="mt-2 text-3xl font-black sm:text-4xl">Estamos aqui para ajudar</h2><p className="mt-2 text-slate-300">Encontre as respostas para as dúvidas mais comuns.</p><div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-5">{["O MoneyTrack é gratuito?", "Preciso instalar algum aplicativo?", "Posso usar no celular?", "Meus dados ficam salvos?", "Posso registrar compras por foto?"].map((question) => <details key={question} className="group rounded-xl border border-violet-300/15 bg-[#081832] px-4 py-3"><summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-sm font-semibold"><span>{question}</span><span className="text-xl text-violet-300 transition group-open:rotate-45">+</span></summary><p className="mt-3 text-sm leading-5 text-slate-300">Sim. O MoneyTrack foi pensado para funcionar de forma simples, segura e acessível em seus dispositivos.</p></details>)}</div></div></section>

      {selectedFeature && <div className="fixed inset-0 z-50 grid place-items-center bg-[#020817]/80 p-4 backdrop-blur-sm sm:p-5" role="dialog" aria-modal="true" aria-labelledby="feature-title" onClick={() => setSelectedFeature(null)}><div className="max-h-[calc(100dvh-2rem)] w-full max-w-md overflow-y-auto rounded-2xl border border-violet-400/40 bg-[#0b1730] p-5 shadow-2xl sm:p-7" onClick={(event) => event.stopPropagation()}><div className="flex items-start justify-between gap-5"><div><p className="text-xs font-bold uppercase tracking-[.17em] text-violet-300">Recurso MoneyTrack</p><h2 id="feature-title" className="mt-2 text-xl font-black sm:text-2xl">{selectedFeature.title}</h2></div><button type="button" onClick={() => setSelectedFeature(null)} className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-white/15 text-xl hover:bg-white/10" aria-label="Fechar">×</button></div><p className="mt-5 leading-7 text-slate-300">{selectedFeature.details}</p><Link to="/register" className="mt-7 inline-flex rounded-xl bg-gradient-to-r from-violet-600 to-blue-500 px-5 py-3 font-bold">Experimentar grátis</Link></div></div>}
    </main>
  );
}
