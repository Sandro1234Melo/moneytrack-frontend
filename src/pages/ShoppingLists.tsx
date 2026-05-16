import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ElementType,
  type ReactNode,
} from "react";
import {
  CalendarDays,
  Check,
  ClipboardList,
  Edit3,
  Filter,
  Lightbulb,
  Loader2,
  MoreVertical,
  PackagePlus,
  Play,
  Plus,
  Search,
  ShoppingCart,
  Sparkles,
  Store,
  Trash2,
  Trophy,
  Wallet,
  X,
} from "lucide-react";
import api from "../api/axios";
import { getLoggedUser } from "../utils/auth";
import { paymentMethods } from "../utils/paymentMethods";
import {
  addShoppingListItem,
  checkShoppingListItem,
  convertShoppingList,
  createShoppingList,
  deleteShoppingList,
  deleteShoppingListItem,
  executeShoppingList,
  getShoppingListsByUser,
  updateShoppingList,
  updateShoppingListItem,
  type ShoppingList,
  type ShoppingListItem,
  type ShoppingListItemPayload,
} from "../services/shoppingListService";

type Category = { id: number; name: string };
type Location = { id: number; name: string };
type StatusFilter = "Todas" | "Ativas" | "Em andamento" | "Finalizadas";

type ListForm = {
  name: string;
  locationId: string;
  plannedDate: string;
};

type ItemForm = {
  description: string;
  categoryId: string;
  quantity: string;
  price: string;
};

const statusFilters: StatusFilter[] = [
  "Todas",
  "Ativas",
  "Em andamento",
  "Finalizadas",
];

const initialListForm: ListForm = {
  name: "",
  locationId: "",
  plannedDate: new Date().toISOString().slice(0, 10),
};

const initialItemForm: ItemForm = {
  description: "",
  categoryId: "",
  quantity: "1",
  price: "",
};

const statusLabel: Record<string, string> = {
  Draft: "Ativa",
  InProgress: "Em andamento",
  Completed: "Finalizada",
  Converted: "Convertida",
};

const statusClass: Record<string, string> = {
  Draft: "bg-amber-500/15 text-amber-300 border-amber-400/20",
  InProgress: "bg-blue-500/15 text-blue-300 border-blue-400/20",
  Completed: "bg-emerald-500/15 text-emerald-300 border-emerald-400/20",
  Converted: "bg-violet-500/15 text-violet-300 border-violet-400/20",
};

const iconPalette = [
  "from-violet-600 to-fuchsia-600",
  "from-emerald-500 to-teal-600",
  "from-blue-500 to-cyan-600",
  "from-orange-500 to-amber-600",
  "from-pink-500 to-rose-600",
];

const toInputDate = (date?: string) => {
  if (!date) return new Date().toISOString().slice(0, 10);
  return new Date(date).toISOString().slice(0, 10);
};

const ShoppingLists = () => {
  const user = getLoggedUser();
  const userId = user?.id as number | undefined;
  const currency = user?.currencySymbol || "€";

  const [lists, setLists] = useState<ShoppingList[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<StatusFilter>("Todas");
  const [sortBy, setSortBy] = useState("updated");
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showListModal, setShowListModal] = useState(false);
  const [editingList, setEditingList] = useState<ShoppingList | null>(null);
  const [listForm, setListForm] = useState<ListForm>(initialListForm);
  const [itemList, setItemList] = useState<ShoppingList | null>(null);
  const [editingItem, setEditingItem] = useState<ShoppingListItem | null>(null);
  const [itemForm, setItemForm] = useState<ItemForm>(initialItemForm);
  const [convertList, setConvertList] = useState<ShoppingList | null>(null);
  const [paymentMethod, setPaymentMethod] = useState("0");

  const money = useCallback(
    (value: number | null | undefined) => {
      const safeValue = Number(value ?? 0);
      return `${currency} ${safeValue.toLocaleString("pt-PT", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    },
    [currency],
  );

  const showError = useCallback((message: string) => {
    setError(message);
    window.setTimeout(() => setError(""), 5000);
  }, []);

  const showSuccess = useCallback((message: string) => {
    setSuccess(message);
    window.setTimeout(() => setSuccess(""), 3000);
  }, []);

  const extractError = (err: unknown) => {
    if (typeof err === "object" && err !== null && "response" in err) {
      const response = (
        err as {
          response?: {
            data?: { error?: string; message?: string; details?: string };
          };
        }
      ).response;
      const details = response?.data?.details;
      const error = response?.data?.error;
      const message = response?.data?.message;

      if (details && error && details !== error) return `${error} - ${details}`;
      return details || error || message || "Erro inesperado.";
    }
    return "Erro inesperado.";
  };

  const loadLists = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const response = await getShoppingListsByUser(userId, { search, status });
      setLists(response.data);
      setExpandedId((current) => current ?? response.data[0]?.id ?? null);
    } catch (err) {
      showError(extractError(err));
    } finally {
      setLoading(false);
    }
  }, [search, showError, status, userId]);

  const loadAuxiliaryData = useCallback(async () => {
    if (!userId) return;
    try {
      const [categoryResponse, locationResponse] = await Promise.all([
        api.get<Category[]>(`/categories/${userId}`),
        api.get<Location[]>(`/locations/${userId}`),
      ]);
      setCategories(categoryResponse.data);
      setLocations(locationResponse.data);
    } catch (err) {
      showError(extractError(err));
    }
  }, [showError, userId]);

  useEffect(() => {
    loadAuxiliaryData();
  }, [loadAuxiliaryData]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      loadLists();
    }, 250);

    return () => window.clearTimeout(timer);
  }, [loadLists]);

  const sortedLists = useMemo(() => {
    const copy = [...lists];
    if (sortBy === "name")
      return copy.sort((a, b) => a.name.localeCompare(b.name));
    if (sortBy === "value")
      return copy.sort((a, b) => b.estimatedTotal - a.estimatedTotal);
    if (sortBy === "progress")
      return copy.sort((a, b) => b.progressPercent - a.progressPercent);
    return copy.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  }, [lists, sortBy]);

  const stats = useMemo(() => {
    const totalLists = lists.length;
    const pendingItems = lists.reduce(
      (sum, list) => sum + list.items.filter((item) => !item.checked).length,
      0,
    );
    const estimatedTotal = lists.reduce(
      (sum, list) => sum + Number(list.estimatedTotal || 0),
      0,
    );
    const potentialSavings = estimatedTotal * 0.08;
    return { totalLists, pendingItems, estimatedTotal, potentialSavings };
  }, [lists]);

  const economyRanking = useMemo(() => {
    return [...lists]
      .sort((a, b) => b.estimatedTotal - a.estimatedTotal)
      .slice(0, 3)
      .map((list) => ({
        name: list.name,
        economy: list.estimatedTotal * 0.08,
      }));
  }, [lists]);

  const openCreateList = () => {
    setEditingList(null);
    setListForm(initialListForm);
    setShowListModal(true);
  };

  const openEditList = (list: ShoppingList) => {
    setEditingList(list);
    setListForm({
      name: list.name,
      locationId: list.locationId ? String(list.locationId) : "",
      plannedDate: toInputDate(list.plannedDate),
    });
    setShowListModal(true);
  };

  const saveList = async () => {
    if (!userId) return;
    if (!listForm.name.trim()) {
      showError("Informe o nome da lista.");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        name: listForm.name.trim(),
        locationId: listForm.locationId ? Number(listForm.locationId) : null,
        plannedDate: listForm.plannedDate
          ? new Date(`${listForm.plannedDate}T00:00:00Z`).toISOString()
          : null,
      };

      if (editingList) {
        await updateShoppingList(editingList.id, payload);
        showSuccess("Lista atualizada com sucesso.");
      } else {
        const response = await createShoppingList({
          userId,
          ...payload,
          items: [],
        });
        setExpandedId(response.data.id);
        showSuccess("Lista criada com sucesso.");
      }

      setShowListModal(false);
      setEditingList(null);
      await loadLists();
    } catch (err) {
      showError(extractError(err));
    } finally {
      setSaving(false);
    }
  };

  const openItemModal = (list: ShoppingList, item?: ShoppingListItem) => {
    setItemList(list);
    setEditingItem(item ?? null);
    setItemForm(
      item
        ? {
            description: item.description,
            categoryId: String(item.categoryId),
            quantity: String(item.quantity),
            price:
              item.price === null || item.price === undefined
                ? ""
                : String(item.price),
          }
        : initialItemForm,
    );
  };

  const itemPayloadFromForm = (): ShoppingListItemPayload | null => {
    if (!itemForm.description.trim()) {
      showError("Informe o produto da lista.");
      return null;
    }

    if (!itemForm.categoryId) {
      showError("Selecione uma categoria.");
      return null;
    }

    const quantity = Number(itemForm.quantity.replace(",", "."));
    const price = itemForm.price.trim()
      ? Number(itemForm.price.replace(",", "."))
      : null;

    if (!Number.isFinite(quantity) || quantity <= 0) {
      showError("Informe uma quantidade válida.");
      return null;
    }

    if (price !== null && (!Number.isFinite(price) || price < 0)) {
      showError("Informe um preço válido.");
      return null;
    }

    return {
      description: itemForm.description.trim(),
      categoryId: Number(itemForm.categoryId),
      quantity,
      price,
      checked: editingItem?.checked ?? false,
    };
  };

  const saveItem = async () => {
    if (!itemList) return;
    const payload = itemPayloadFromForm();
    if (!payload) return;

    setSaving(true);
    try {
      if (editingItem) {
        await updateShoppingListItem(itemList.id, editingItem.id, payload);
        showSuccess("Item atualizado.");
      } else {
        await addShoppingListItem(itemList.id, payload);
        showSuccess("Item adicionado.");
      }

      setItemList(null);
      setEditingItem(null);
      await loadLists();
    } catch (err) {
      showError(extractError(err));
    } finally {
      setSaving(false);
    }
  };

  const toggleItem = async (listId: number, item: ShoppingListItem) => {
    try {
      await checkShoppingListItem(listId, item.id, !item.checked);
      await loadLists();
    } catch (err) {
      showError(extractError(err));
    }
  };

  const removeItem = async (listId: number, itemId: number) => {
    if (!window.confirm("Remover este item da lista?")) return;
    try {
      await deleteShoppingListItem(listId, itemId);
      showSuccess("Item removido.");
      await loadLists();
    } catch (err) {
      showError(extractError(err));
    }
  };

  const removeList = async (list: ShoppingList) => {
    if (!window.confirm(`Excluir a lista "${list.name}"?`)) return;
    try {
      await deleteShoppingList(list.id);
      showSuccess("Lista excluída.");
      await loadLists();
    } catch (err) {
      showError(extractError(err));
    }
  };

  const executeList = async (list: ShoppingList) => {
    try {
      await executeShoppingList(list.id);
      showSuccess("Lista marcada como em andamento.");
      await loadLists();
    } catch (err) {
      showError(extractError(err));
    }
  };

  const confirmConvert = async () => {
    if (!convertList) return;
    setSaving(true);
    try {
      await convertShoppingList(convertList.id, {
        paymentMethod: Number(paymentMethod),
        locationId: convertList.locationId,
      });
      setConvertList(null);
      showSuccess("Lista convertida em gasto com sucesso.");
      await loadLists();
    } catch (err) {
      showError(extractError(err));
    } finally {
      setSaving(false);
    }
  };

  const formatDate = (value: string) =>
    new Date(value).toLocaleDateString("pt-PT");

  return (
    <div className="mx-auto w-full max-w-7xl space-y-5 pb-24 sm:space-y-6 lg:pb-8">
      {error && (
        <div className="fixed left-4 right-4 top-20 z-50 rounded-2xl border border-red-500/30 bg-red-950/90 px-4 py-3 text-sm text-red-100 shadow-xl sm:left-auto sm:right-6 sm:max-w-xl">
          {error}
        </div>
      )}
      {success && (
        <div className="fixed left-4 right-4 top-20 z-50 rounded-2xl border border-emerald-500/30 bg-emerald-950/90 px-4 py-3 text-sm text-emerald-100 shadow-xl sm:left-auto sm:right-6 sm:max-w-xl">
          {success}
        </div>
      )}

      <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div className="min-w-0">
          <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Listas de Compras
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
            Organize suas compras, acompanhe itens pendentes e converta listas
            em gastos reais.
          </p>
        </div>
        <button
          onClick={openCreateList}
          className="inline-flex h-12 w-full shrink-0 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-600 to-blue-600 px-6 font-bold text-white shadow-lg shadow-violet-900/30 transition hover:scale-[1.01] sm:w-auto"
        >
          <Plus size={20} /> Nova Lista
        </button>
      </header>

      <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 xl:grid-cols-4">
        <SummaryCard
          icon={ClipboardList}
          title="Total de listas"
          value={String(stats.totalLists)}
          hint="listas cadastradas"
          tone="violet"
        />
        <SummaryCard
          icon={PackagePlus}
          title="Itens pendentes"
          value={String(stats.pendingItems)}
          hint="ainda não comprados"
          tone="blue"
        />
        <SummaryCard
          icon={Wallet}
          title="Valor estimado"
          value={money(stats.estimatedTotal)}
          hint="em listas ativas"
          tone="emerald"
        />
        <SummaryCard
          icon={Sparkles}
          title="Economia potencial"
          value={money(stats.potentialSavings)}
          hint="estimativa com pesquisa"
          tone="orange"
        />
      </section>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_300px]">
        <main className="space-y-4">
          <section className="rounded-3xl border border-white/10 bg-[#071224]/80 p-3 shadow-xl shadow-black/20 sm:p-4">
            <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
              <div className="relative flex-1">
                <Search
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                  size={18}
                />
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Buscar listas..."
                  className="h-12 w-full rounded-2xl border border-white/10 bg-white/[0.04] pl-11 pr-4 text-white outline-none transition focus:border-violet-500/70"
                />
              </div>
              <div className="scrollbar-hide flex max-w-full gap-2 overflow-x-auto rounded-2xl border border-white/10 bg-black/20 p-1">
                {statusFilters.map((item) => (
                  <button
                    key={item}
                    onClick={() => setStatus(item)}
                    className={`shrink-0 rounded-xl px-4 py-2 text-sm font-semibold transition ${status === item ? "bg-violet-600 text-white shadow-lg shadow-violet-900/30" : "text-slate-300 hover:bg-white/5"}`}
                  >
                    {item}
                  </button>
                ))}
              </div>
              <div className="flex w-full items-center gap-2 text-sm text-slate-400 xl:w-auto">
                <Filter size={17} className="shrink-0" />
                <select
                  value={sortBy}
                  onChange={(event) => setSortBy(event.target.value)}
                  className="h-11 w-full rounded-xl border border-white/10 bg-[#0b1628] px-3 text-white outline-none xl:w-auto"
                >
                  <option value="updated">Última atualização</option>
                  <option value="value">Maior valor</option>
                  <option value="progress">Mais avançadas</option>
                  <option value="name">Nome</option>
                </select>
              </div>
            </div>
          </section>

          {loading ? (
            <div className="flex h-56 items-center justify-center rounded-3xl border border-white/10 bg-[#071224]/80 text-slate-400">
              <Loader2 className="mr-2 animate-spin" /> Carregando listas...
            </div>
          ) : sortedLists.length === 0 ? (
            <EmptyState onCreate={openCreateList} />
          ) : (
            <section className="space-y-3">
              {sortedLists.map((list, index) => (
                <ShoppingListRow
                  key={list.id}
                  list={list}
                  index={index}
                  expanded={expandedId === list.id}
                  currencyFormatter={money}
                  onExpand={() =>
                    setExpandedId(expandedId === list.id ? null : list.id)
                  }
                  onAddItem={() => openItemModal(list)}
                  onEditItem={(item) => openItemModal(list, item)}
                  onToggleItem={(item) => toggleItem(list.id, item)}
                  onDeleteItem={(itemId) => removeItem(list.id, itemId)}
                  onEditList={() => openEditList(list)}
                  onDeleteList={() => removeList(list)}
                  onExecute={() => executeList(list)}
                  onConvert={() => setConvertList(list)}
                  formatDate={formatDate}
                />
              ))}
            </section>
          )}
        </main>

        <aside className="space-y-4 xl:sticky xl:top-6 xl:self-start">
          <InsightCard title="Melhor dia para comprar" icon={CalendarDays}>
            <p className="text-xl font-bold text-emerald-300">Terças-feiras</p>
            <p className="mt-1 text-sm text-slate-400">
              Itens em média 12% mais baratos.
            </p>
            <div className="mt-5 flex h-24 items-end gap-3">
              {[32, 74, 45, 48, 36, 51, 28].map((height, index) => (
                <div
                  key={index}
                  className="flex flex-1 flex-col items-center gap-2"
                >
                  <div
                    className={`w-full rounded-t-lg ${index === 1 ? "bg-emerald-400" : "bg-slate-600/60"}`}
                    style={{ height: `${height}%` }}
                  />
                  <span
                    className={`text-xs ${index === 1 ? "text-emerald-300" : "text-slate-500"}`}
                  >
                    {["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"][index]}
                  </span>
                </div>
              ))}
            </div>
          </InsightCard>

          <InsightCard title="Listas com maior economia" icon={Trophy}>
            <div className="space-y-4">
              {economyRanking.length === 0 ? (
                <p className="text-sm text-slate-400">
                  Crie listas para ver o ranking.
                </p>
              ) : (
                economyRanking.map((item, index) => (
                  <div key={item.name} className="flex items-center gap-3">
                    <span className="grid h-9 w-9 place-items-center rounded-full bg-white/5 text-sm font-bold text-slate-300">
                      {index + 1}
                    </span>
                    <div>
                      <p className="font-semibold text-white">{item.name}</p>
                      <p className="font-bold text-emerald-300">
                        {money(item.economy)}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </InsightCard>

          <InsightCard title="Dica para você" icon={Lightbulb}>
            <p className="text-sm leading-6 text-slate-400">
              Ao finalizar uma lista, use{" "}
              <strong className="text-white">Converter em gasto</strong> para
              manter Dashboard, Análises e Meus Gastos sempre atualizados.
            </p>
          </InsightCard>
        </aside>
      </div>

      {showListModal && (
        <Modal
          title={editingList ? "Editar lista" : "Nova lista"}
          onClose={() => setShowListModal(false)}
        >
          <div className="space-y-4">
            <Field label="Nome da lista">
              <input
                value={listForm.name}
                onChange={(event) =>
                  setListForm({ ...listForm, name: event.target.value })
                }
                placeholder="Ex.: Compras da Semana"
                className="form-input"
              />
            </Field>
            <Field label="Local sugerido">
              <select
                value={listForm.locationId}
                onChange={(event) =>
                  setListForm({ ...listForm, locationId: event.target.value })
                }
                className="form-input"
              >
                <option value="">Sem local definido</option>
                {locations.map((location) => (
                  <option key={location.id} value={location.id}>
                    {location.name}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Data planejada">
              <input
                type="date"
                value={listForm.plannedDate}
                onChange={(event) =>
                  setListForm({ ...listForm, plannedDate: event.target.value })
                }
                className="form-input"
              />
            </Field>
            <ModalActions
              onCancel={() => setShowListModal(false)}
              onConfirm={saveList}
              loading={saving}
              confirmLabel={editingList ? "Salvar alterações" : "Criar lista"}
            />
          </div>
        </Modal>
      )}

      {itemList && (
        <Modal
          title={editingItem ? "Editar item" : "Novo item"}
          onClose={() => setItemList(null)}
        >
          <div className="space-y-4">
            <Field label="Produto">
              <input
                value={itemForm.description}
                onChange={(event) =>
                  setItemForm({ ...itemForm, description: event.target.value })
                }
                placeholder="Ex.: Arroz 5kg"
                className="form-input"
              />
            </Field>
            <Field label="Categoria">
              <select
                value={itemForm.categoryId}
                onChange={(event) =>
                  setItemForm({ ...itemForm, categoryId: event.target.value })
                }
                className="form-input"
              >
                <option value="">Selecione...</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </Field>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Field label="Quantidade">
                <input
                  type="number"
                  min="1"
                  value={itemForm.quantity}
                  onChange={(event) =>
                    setItemForm({ ...itemForm, quantity: event.target.value })
                  }
                  className="form-input"
                />
              </Field>
              <Field label="Preço unitário">
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={itemForm.price}
                  onChange={(event) =>
                    setItemForm({ ...itemForm, price: event.target.value })
                  }
                  placeholder="0,00"
                  className="form-input"
                />
              </Field>
            </div>
            {categories.length === 0 && (
              <p className="rounded-2xl border border-amber-500/20 bg-amber-500/10 p-3 text-sm text-amber-200">
                Cadastre pelo menos uma categoria antes de adicionar itens.
              </p>
            )}
            <ModalActions
              onCancel={() => setItemList(null)}
              onConfirm={saveItem}
              loading={saving}
              confirmLabel={editingItem ? "Salvar item" : "Adicionar item"}
            />
          </div>
        </Modal>
      )}

      {convertList && (
        <Modal
          title="Converter lista em gasto"
          onClose={() => setConvertList(null)}
        >
          <div className="space-y-4">
            <p className="text-sm leading-6 text-slate-400">
              A lista <strong className="text-white">{convertList.name}</strong>{" "}
              será registrada em Meus Gastos. Se houver itens marcados como
              comprados, somente eles serão convertidos.
            </p>
            <Field label="Forma de pagamento">
              <select
                value={paymentMethod}
                onChange={(event) => setPaymentMethod(event.target.value)}
                className="form-input"
              >
                {paymentMethods.map((method) => (
                  <option key={method.value} value={method.value}>
                    {method.label}
                  </option>
                ))}
              </select>
            </Field>
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <p className="text-sm text-slate-400">Total estimado</p>
              <p className="mt-1 text-3xl font-bold text-violet-300">
                {money(convertList.estimatedTotal)}
              </p>
            </div>
            <ModalActions
              onCancel={() => setConvertList(null)}
              onConfirm={confirmConvert}
              loading={saving}
              confirmLabel="Converter agora"
            />
          </div>
        </Modal>
      )}
    </div>
  );
};

type SummaryCardProps = {
  icon: ElementType;
  title: string;
  value: string;
  hint: string;
  tone: "violet" | "blue" | "emerald" | "orange";
};

const toneClass: Record<SummaryCardProps["tone"], string> = {
  violet: "bg-violet-500/15 text-violet-300",
  blue: "bg-blue-500/15 text-blue-300",
  emerald: "bg-emerald-500/15 text-emerald-300",
  orange: "bg-orange-500/15 text-orange-300",
};

const SummaryCard = ({
  icon: Icon,
  title,
  value,
  hint,
  tone,
}: SummaryCardProps) => (
  <div className="rounded-3xl border border-white/10 bg-[#071224]/80 p-4 shadow-xl shadow-black/20 sm:p-5">
    <div
      className={`mb-4 grid h-12 w-12 place-items-center rounded-2xl sm:h-14 sm:w-14 ${toneClass[tone]}`}
    >
      <Icon size={24} />
    </div>
    <p className="text-sm text-slate-400">{title}</p>
    <p className="mt-1 break-words text-xl font-bold text-white sm:text-2xl">
      {value}
    </p>
    <p className="mt-1 text-xs text-slate-500 sm:text-sm">{hint}</p>
  </div>
);

type RowProps = {
  list: ShoppingList;
  index: number;
  expanded: boolean;
  currencyFormatter: (value: number | null | undefined) => string;
  onExpand: () => void;
  onAddItem: () => void;
  onEditItem: (item: ShoppingListItem) => void;
  onToggleItem: (item: ShoppingListItem) => void;
  onDeleteItem: (itemId: number) => void;
  onEditList: () => void;
  onDeleteList: () => void;
  onExecute: () => void;
  onConvert: () => void;
  formatDate: (value: string) => string;
};

const ShoppingListRow = ({
  list,
  index,
  expanded,
  currencyFormatter,
  onExpand,
  onAddItem,
  onEditItem,
  onToggleItem,
  onDeleteItem,
  onEditList,
  onDeleteList,
  onExecute,
  onConvert,
  formatDate,
}: RowProps) => {
  const canEdit = list.status !== "Converted";
  const shownItems = expanded ? list.items : [];

  return (
    <article
      className={`overflow-hidden rounded-3xl border bg-[#071224]/80 shadow-xl shadow-black/20 ${expanded ? "border-violet-500/50" : "border-white/10"}`}
    >
      <div className="grid gap-4 p-4 xl:grid-cols-[minmax(230px,1.6fr)_0.6fr_0.7fr_0.7fr_0.9fr_minmax(220px,1.1fr)] xl:items-center">
        <div className="flex min-w-0 items-center gap-3 sm:gap-4">
          <div
            className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br ${iconPalette[index % iconPalette.length]} text-white shadow-lg shadow-violet-950/40`}
          >
            <ShoppingCart size={22} />
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="truncate text-lg font-bold text-white">
                {list.name}
              </h3>
              <span
                className={`rounded-full border px-2 py-1 text-xs font-semibold ${statusClass[list.status] ?? statusClass.Draft}`}
              >
                {statusLabel[list.status] ?? list.status}
              </span>
            </div>
            <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-slate-400">
              <span className="inline-flex items-center gap-1">
                <Store size={14} /> {list.locationName || "Sem local"}
              </span>
              <span className="inline-flex items-center gap-1">
                <CalendarDays size={14} /> {formatDate(list.plannedDate)}
              </span>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 xl:contents">
          <InfoBlock label="Itens" value={`${list.totalItems}`} />
          <InfoBlock
            label="Estimado"
            value={currencyFormatter(list.estimatedTotal)}
          />
          <div>
            <p className="text-xs text-slate-500">Progresso</p>
            <p className="mt-1 text-sm font-bold text-white">
              {Math.round(list.progressPercent)}%
            </p>
            <div className="mt-2 h-2 rounded-full bg-white/10">
              <div
                className="h-2 rounded-full bg-violet-500"
                style={{ width: `${Math.min(100, list.progressPercent)}%` }}
              />
            </div>
          </div>
          <InfoBlock
            label="Comprados"
            value={`${list.checkedItems} de ${list.totalItems}`}
          />
        </div>
        <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:justify-start xl:justify-end">
          <button
            onClick={onExpand}
            className="rounded-xl border border-white/10 px-3 py-2 text-sm text-slate-200 hover:bg-white/5"
          >
            {expanded ? "Fechar" : "Abrir"}
          </button>
          {canEdit && (
            <button
              onClick={onExecute}
              className="rounded-xl border border-violet-500/30 px-3 py-2 text-sm text-violet-200 hover:bg-violet-500/10"
            >
              <Play size={15} className="inline" /> Executar
            </button>
          )}
          {canEdit && (
            <button
              onClick={onConvert}
              className="col-span-2 rounded-xl bg-violet-600 px-3 py-2 text-sm font-bold text-white hover:bg-violet-500 sm:col-span-1"
            >
              Converter
            </button>
          )}
          <button
            onClick={onEditList}
            className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 text-slate-300 hover:bg-white/5"
          >
            <Edit3 size={17} />
          </button>
          <button
            onClick={onDeleteList}
            className="grid h-10 w-10 place-items-center rounded-xl border border-red-500/20 text-red-300 hover:bg-red-500/10"
          >
            <Trash2 size={17} />
          </button>
        </div>
      </div>

      {expanded && (
        <div className="border-t border-white/10 bg-black/10 p-4">
          <div className="mb-3 flex items-center justify-between gap-3">
            <h4 className="font-bold text-white">Itens da lista</h4>
            {canEdit && (
              <button
                onClick={onAddItem}
                className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-violet-500/40 px-3 py-2 text-sm font-semibold text-violet-200 hover:bg-violet-500/10 sm:px-4"
              >
                <Plus size={16} /> Novo item
              </button>
            )}
          </div>

          {shownItems.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-white/10 p-6 text-center text-sm text-slate-400">
              Nenhum item nesta lista ainda.
            </div>
          ) : (
            <>
              <div className="hidden overflow-x-auto md:block">
                <table className="w-full min-w-[760px] text-left text-sm">
                  <thead className="text-xs uppercase text-slate-500">
                    <tr>
                      <th className="px-3 py-3">Item</th>
                      <th className="px-3 py-3">Categoria</th>
                      <th className="px-3 py-3">Preço Unit.</th>
                      <th className="px-3 py-3">Quant.</th>
                      <th className="px-3 py-3">Total</th>
                      <th className="px-3 py-3 text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {shownItems.map((item) => (
                      <tr
                        key={item.id}
                        className={
                          item.checked ? "text-slate-400" : "text-slate-100"
                        }
                      >
                        <td className="px-3 py-3">
                          <button
                            onClick={() => onToggleItem(item)}
                            className={`mr-3 inline-grid h-6 w-6 place-items-center rounded-lg border ${item.checked ? "border-violet-500 bg-violet-600 text-white" : "border-white/15 text-transparent"}`}
                          >
                            <Check size={15} />
                          </button>
                          <span className={item.checked ? "line-through" : ""}>
                            {item.description}
                          </span>
                        </td>
                        <td className="px-3 py-3">
                          <span className="rounded-full bg-white/5 px-3 py-1 text-xs text-slate-300">
                            {item.categoryName || "Sem categoria"}
                          </span>
                        </td>
                        <td className="px-3 py-3">
                          {currencyFormatter(item.price)}
                        </td>
                        <td className="px-3 py-3">{item.quantity}</td>
                        <td className="px-3 py-3 font-bold text-white">
                          {currencyFormatter(item.total)}
                        </td>
                        <td className="px-3 py-3">
                          <div className="flex justify-end gap-2">
                            {canEdit && (
                              <button
                                onClick={() => onEditItem(item)}
                                className="rounded-lg border border-white/10 p-2 text-slate-300 hover:bg-white/5"
                              >
                                <Edit3 size={16} />
                              </button>
                            )}
                            {canEdit && (
                              <button
                                onClick={() => onDeleteItem(item.id)}
                                className="rounded-lg border border-red-500/20 p-2 text-red-300 hover:bg-red-500/10"
                              >
                                <Trash2 size={16} />
                              </button>
                            )}
                            {!canEdit && (
                              <MoreVertical
                                className="text-slate-500"
                                size={18}
                              />
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="space-y-3 md:hidden">
                {shownItems.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-2xl border border-white/10 bg-white/[0.03] p-3"
                  >
                    <div className="flex items-start gap-3">
                      <button
                        onClick={() => onToggleItem(item)}
                        className={`mt-1 inline-grid h-7 w-7 shrink-0 place-items-center rounded-lg border ${item.checked ? "border-violet-500 bg-violet-600 text-white" : "border-white/15 text-transparent"}`}
                      >
                        <Check size={15} />
                      </button>
                      <div className="min-w-0 flex-1">
                        <p
                          className={`break-words font-semibold ${item.checked ? "text-slate-400 line-through" : "text-white"}`}
                        >
                          {item.description}
                        </p>
                        <div className="mt-2 flex flex-wrap gap-2 text-xs text-slate-400">
                          <span className="rounded-full bg-white/5 px-2 py-1">
                            {item.categoryName || "Sem categoria"}
                          </span>
                          <span>Qtd: {item.quantity}</span>
                          <span>Unit: {currencyFormatter(item.price)}</span>
                        </div>
                        <div className="mt-3 flex items-center justify-between gap-3">
                          <span className="text-sm text-slate-400">Total</span>
                          <span className="font-bold text-white">
                            {currencyFormatter(item.total)}
                          </span>
                        </div>
                      </div>
                      <div className="flex shrink-0 flex-col gap-2">
                        {canEdit && (
                          <button
                            onClick={() => onEditItem(item)}
                            className="rounded-lg border border-white/10 p-2 text-slate-300 hover:bg-white/5"
                          >
                            <Edit3 size={16} />
                          </button>
                        )}
                        {canEdit && (
                          <button
                            onClick={() => onDeleteItem(item.id)}
                            className="rounded-lg border border-red-500/20 p-2 text-red-300 hover:bg-red-500/10"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </article>
  );
};

const InfoBlock = ({ label, value }: { label: string; value: string }) => (
  <div className="min-w-0 rounded-2xl bg-white/[0.03] p-3 xl:bg-transparent xl:p-0">
    <p className="text-xs text-slate-500">{label}</p>
    <p className="mt-1 break-words font-bold text-white">{value}</p>
  </div>
);

const EmptyState = ({ onCreate }: { onCreate: () => void }) => (
  <div className="rounded-3xl border border-dashed border-white/10 bg-[#071224]/80 p-6 text-center sm:p-12">
    <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-violet-500/15 text-violet-300">
      <ClipboardList size={30} />
    </div>
    <h2 className="mt-5 text-xl font-bold text-white">
      Nenhuma lista encontrada
    </h2>
    <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-400">
      Crie sua primeira lista, adicione produtos, marque os itens comprados e
      converta tudo em gasto real.
    </p>
    <button
      onClick={onCreate}
      className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-violet-600 to-blue-600 px-5 py-3 font-bold text-white"
    >
      <Plus size={18} /> Criar lista
    </button>
  </div>
);

const InsightCard = ({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: ElementType;
  children: ReactNode;
}) => (
  <section className="rounded-3xl border border-white/10 bg-[#071224]/80 p-5 shadow-xl shadow-black/20">
    <div className="mb-4 flex items-center gap-3">
      <div className="grid h-10 w-10 place-items-center rounded-xl bg-violet-500/15 text-violet-300">
        <Icon size={20} />
      </div>
      <h3 className="font-bold text-white">{title}</h3>
    </div>
    {children}
  </section>
);

const Modal = ({
  title,
  children,
  onClose,
}: {
  title: string;
  children: ReactNode;
  onClose: () => void;
}) => (
  <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 p-0 backdrop-blur-sm sm:items-center sm:p-4">
    <div className="max-h-[92vh] w-full overflow-y-auto rounded-t-3xl border border-white/10 bg-[#081326] p-5 shadow-2xl shadow-black/50 sm:max-w-lg sm:rounded-3xl sm:p-6">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">{title}</h2>
        <button
          onClick={onClose}
          className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 text-slate-300 hover:bg-white/5"
        >
          <X size={18} />
        </button>
      </div>
      {children}
    </div>
  </div>
);

const Field = ({ label, children }: { label: string; children: ReactNode }) => (
  <label className="block">
    <span className="mb-2 block text-sm font-semibold text-slate-300">
      {label}
    </span>
    {children}
  </label>
);

const ModalActions = ({
  onCancel,
  onConfirm,
  loading,
  confirmLabel,
}: {
  onCancel: () => void;
  onConfirm: () => void;
  loading: boolean;
  confirmLabel: string;
}) => (
  <div className="grid grid-cols-1 gap-3 pt-2 sm:flex sm:justify-end">
    <button
      onClick={onCancel}
      className="rounded-xl border border-white/10 px-5 py-3 text-slate-300 hover:bg-white/5 sm:order-1"
    >
      Cancelar
    </button>
    <button
      onClick={onConfirm}
      disabled={loading}
      className="inline-flex min-w-36 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 px-5 py-3 font-bold text-white disabled:opacity-60 sm:order-2"
    >
      {loading && <Loader2 className="animate-spin" size={17} />} {confirmLabel}
    </button>
  </div>
);

export default ShoppingLists;
