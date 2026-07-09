"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type Dispatch,
  type FormEvent,
  type SetStateAction,
} from "react";
import { formatCurrency, formatDate } from "@/lib/utils";

type NavSection = "bookings" | "tours" | "hunting" | "survival";

type PackageRow = {
  id: string;
  slug: string;
  title: string;
  category: string;
  description: string;
  longDescription: string;
  destination: string;
  duration: string;
  difficulty: string | null;
  species: string | null;
  priceUsd: number;
  depositPercent: number;
  maxGuests: number;
  imageUrl: string;
  highlights: string;
  included: string;
  excluded: string;
  active: boolean;
  featured: boolean;
  sortOrder: number;
  _count?: { bookings: number };
};

type Booking = {
  id: string;
  bookingRef: string;
  customerName: string;
  customerEmail: string;
  guests: number;
  startDate: string;
  totalAmount: number;
  depositAmount: number;
  status: string;
  receiptNumber: string | null;
  paidAt: string | null;
  package: { title: string; category: string };
};

const NAV: { id: NavSection; label: string; hint: string }[] = [
  { id: "bookings", label: "Bookings", hint: "Оплаты и заявки" },
  { id: "tours", label: "Tours", hint: "Обычные туры" },
  { id: "hunting", label: "Hunting", hint: "Охота" },
  { id: "survival", label: "Survival", hint: "Survival Challenge" },
];

const EMPTY_FORM = {
  title: "",
  description: "",
  longDescription: "",
  destination: "",
  duration: "",
  difficulty: "Moderate",
  species: "",
  priceUsd: "100",
  depositPercent: "30",
  maxGuests: "10",
  imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80",
  highlights: "",
  included: "",
  excluded: "",
  featured: false,
  active: true,
  sortOrder: "0",
};

function parseLines(text: string): string[] {
  return text
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
}

function linesFromJson(value: string): string {
  try {
    const arr = JSON.parse(value) as unknown;
    if (Array.isArray(arr)) return arr.map(String).join("\n");
  } catch {
    /* ignore */
  }
  return "";
}

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(false);
  const [section, setSection] = useState<NavSection>("tours");
  const [error, setError] = useState("");
  const [okMsg, setOkMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [packages, setPackages] = useState<PackageRow[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);

  const headers = useMemo(
    () => ({
      "x-admin-password": password,
      "Content-Type": "application/json",
    }),
    [password]
  );

  const categorySection = section === "bookings" ? null : section;

  const filteredPackages = useMemo(
    () => (categorySection ? packages.filter((p) => p.category === categorySection) : packages),
    [packages, categorySection]
  );

  const loadBookings = useCallback(async () => {
    const res = await fetch("/api/admin/bookings", { headers: { "x-admin-password": password } });
    if (!res.ok) throw new Error("Unauthorized");
    setBookings(await res.json());
  }, [password]);

  const loadPackages = useCallback(async () => {
    const res = await fetch("/api/admin/packages", { headers: { "x-admin-password": password } });
    if (!res.ok) throw new Error("Unauthorized");
    setPackages(await res.json());
  }, [password]);

  async function login() {
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/admin/packages", {
        headers: { "x-admin-password": password },
      });
      if (!res.ok) {
        setError("Неверный пароль");
        setAuthed(false);
        return;
      }
      setPackages(await res.json());
      setAuthed(true);
      sessionStorage.setItem("td-admin-pass", password);
      await loadBookings().catch(() => undefined);
    } catch {
      setError("Ошибка входа");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const saved = sessionStorage.getItem("td-admin-pass");
    if (saved) setPassword(saved);
  }, []);

  useEffect(() => {
    if (!authed) return;
    setError("");
    setOkMsg("");
    if (section === "bookings") {
      loadBookings().catch(() => setError("Не удалось загрузить bookings"));
    } else {
      loadPackages().catch(() => setError("Не удалось загрузить пакеты"));
    }
  }, [authed, section, loadBookings, loadPackages]);

  function openCreate() {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setShowForm(true);
    setError("");
    setOkMsg("");
  }

  function openEdit(pkg: PackageRow) {
    setEditingId(pkg.id);
    setForm({
      title: pkg.title,
      description: pkg.description,
      longDescription: pkg.longDescription,
      destination: pkg.destination,
      duration: pkg.duration,
      difficulty: pkg.difficulty || "",
      species: pkg.species || "",
      priceUsd: String(pkg.priceUsd),
      depositPercent: String(pkg.depositPercent),
      maxGuests: String(pkg.maxGuests),
      imageUrl: pkg.imageUrl,
      highlights: linesFromJson(pkg.highlights),
      included: linesFromJson(pkg.included),
      excluded: linesFromJson(pkg.excluded),
      featured: pkg.featured,
      active: pkg.active,
      sortOrder: String(pkg.sortOrder),
    });
    setShowForm(true);
    setError("");
    setOkMsg("");
  }

  async function savePackage(e: FormEvent) {
    e.preventDefault();
    if (!categorySection) return;
    setLoading(true);
    setError("");
    setOkMsg("");

    const payload = {
      title: form.title.trim(),
      category: categorySection,
      description: form.description.trim(),
      longDescription: form.longDescription.trim() || form.description.trim(),
      destination: form.destination.trim(),
      duration: form.duration.trim(),
      difficulty: form.difficulty.trim() || null,
      species: categorySection === "hunting" ? form.species.trim() || null : null,
      priceUsd: Number(form.priceUsd),
      depositPercent: Number(form.depositPercent) || 30,
      maxGuests: Number(form.maxGuests) || 10,
      imageUrl: form.imageUrl.trim(),
      highlights: parseLines(form.highlights),
      included: parseLines(form.included),
      excluded: parseLines(form.excluded),
      featured: form.featured,
      active: form.active,
      sortOrder: Number(form.sortOrder) || 0,
    };

    try {
      const res = await fetch(
        editingId ? `/api/admin/packages/${editingId}` : "/api/admin/packages",
        {
          method: editingId ? "PUT" : "POST",
          headers,
          body: JSON.stringify(payload),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Save failed");
      setOkMsg(editingId ? "Пакет обновлён" : "Пакет добавлен");
      setShowForm(false);
      setEditingId(null);
      await loadPackages();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка сохранения");
    } finally {
      setLoading(false);
    }
  }

  async function removePackage(pkg: PackageRow, hard: boolean) {
    const label = hard ? "полностью удалить" : "скрыть с сайта";
    if (!confirm(`${label}: «${pkg.title}»?`)) return;
    setLoading(true);
    setError("");
    setOkMsg("");
    try {
      const url = hard
        ? `/api/admin/packages/${pkg.id}?hard=1`
        : `/api/admin/packages/${pkg.id}`;
      const res = await fetch(url, {
        method: "DELETE",
        headers: { "x-admin-password": password },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Delete failed");
      setOkMsg(hard ? "Удалено" : "Скрыто (active = false)");
      await loadPackages();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка удаления");
    } finally {
      setLoading(false);
    }
  }

  async function toggleActive(pkg: PackageRow) {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/packages/${pkg.id}`, {
        method: "PUT",
        headers,
        body: JSON.stringify({ active: !pkg.active }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Update failed");
      }
      await loadPackages();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка");
    } finally {
      setLoading(false);
    }
  }

  function logout() {
    setAuthed(false);
    setPassword("");
    sessionStorage.removeItem("td-admin-pass");
    setBookings([]);
    setPackages([]);
  }

  // ─── Login ───────────────────────────────────────────────────────────────
  if (!authed) {
    return (
      <div className="min-h-[70vh] bg-surface px-6 py-20">
        <div className="mx-auto max-w-md rounded-2xl bg-white p-8 shadow-sm ring-1 ring-black/[0.06]">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">Admin Panel</h1>
          <p className="mt-2 text-sm text-muted">
            Управление турами, hunting, survival и бронированиями.
          </p>
          <label className="mt-6 block text-sm text-foreground/80">
            Пароль
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && login()}
              className="mt-1 w-full rounded-lg border border-black/[0.1] bg-surface px-3 py-2 text-foreground"
              placeholder="ADMIN_PASSWORD"
            />
          </label>
          {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
          <button
            type="button"
            onClick={login}
            disabled={loading || !password}
            className="mt-5 w-full rounded-full bg-foreground py-2.5 text-sm font-semibold text-white disabled:opacity-50"
          >
            {loading ? "…" : "Войти"}
          </button>
        </div>
      </div>
    );
  }

  // ─── Shell ───────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#f5f5f7]">
      <div className="mx-auto flex min-h-screen max-w-7xl">
        {/* Left nav */}
        <aside className="sticky top-0 flex h-screen w-56 shrink-0 flex-col border-r border-black/[0.06] bg-white px-3 py-6 md:w-64">
          <div className="px-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted">Admin</p>
            <p className="mt-1 text-sm font-semibold text-foreground">TajDiscoveryPro</p>
          </div>

          <nav className="mt-8 flex flex-1 flex-col gap-1">
            {NAV.map((item) => {
              const active = section === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setSection(item.id);
                    setShowForm(false);
                    setEditingId(null);
                  }}
                  className={`rounded-xl px-3 py-2.5 text-left transition ${
                    active
                      ? "bg-foreground text-white"
                      : "text-foreground/80 hover:bg-surface"
                  }`}
                >
                  <span className="block text-sm font-medium">{item.label}</span>
                  <span
                    className={`block text-[11px] ${active ? "text-white/70" : "text-muted"}`}
                  >
                    {item.hint}
                  </span>
                </button>
              );
            })}
          </nav>

          <button
            type="button"
            onClick={logout}
            className="mx-1 mt-4 rounded-xl px-3 py-2 text-left text-sm text-muted hover:bg-surface hover:text-foreground"
          >
            Выйти
          </button>
        </aside>

        {/* Main */}
        <main className="flex-1 px-5 py-8 md:px-8">
          {error && (
            <div className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-800 ring-1 ring-red-200">
              {error}
            </div>
          )}
          {okMsg && (
            <div className="mb-4 rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-800 ring-1 ring-emerald-200">
              {okMsg}
            </div>
          )}

          {section === "bookings" ? (
            <BookingsPanel bookings={bookings} />
          ) : (
            <CategoryPanel
              category={section}
              packages={filteredPackages}
              showForm={showForm}
              form={form}
              setForm={setForm}
              editingId={editingId}
              loading={loading}
              onAdd={openCreate}
              onEdit={openEdit}
              onSave={savePackage}
              onCancel={() => {
                setShowForm(false);
                setEditingId(null);
              }}
              onHide={(p) => removePackage(p, false)}
              onDelete={(p) => removePackage(p, true)}
              onToggleActive={toggleActive}
            />
          )}
        </main>
      </div>
    </div>
  );
}

function BookingsPanel({ bookings }: { bookings: Booking[] }) {
  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight text-foreground">Bookings</h1>
      <p className="mt-1 text-sm text-muted">Заявки и оплаты ({bookings.length})</p>

      <div className="mt-6 overflow-x-auto rounded-2xl bg-white shadow-sm ring-1 ring-black/[0.04]">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="border-b border-black/[0.06] text-xs uppercase tracking-wide text-muted">
            <tr>
              <th className="p-3">Ref</th>
              <th className="p-3">Клиент</th>
              <th className="p-3">Пакет</th>
              <th className="p-3">Дата</th>
              <th className="p-3">Депозит</th>
              <th className="p-3">Статус</th>
              <th className="p-3">Чек</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((b) => (
              <tr key={b.id} className="border-t border-black/[0.04]">
                <td className="p-3 font-mono text-xs">{b.bookingRef}</td>
                <td className="p-3">
                  <p className="font-medium text-foreground">{b.customerName}</p>
                  <p className="text-xs text-muted">{b.customerEmail}</p>
                </td>
                <td className="p-3">
                  <p>{b.package.title}</p>
                  <p className="text-xs uppercase text-muted">{b.package.category}</p>
                </td>
                <td className="p-3 text-muted">{formatDate(b.startDate)}</td>
                <td className="p-3">{formatCurrency(b.depositAmount)}</td>
                <td className="p-3">
                  <span
                    className={
                      b.status === "paid"
                        ? "font-medium text-emerald-600"
                        : "text-amber-600"
                    }
                  >
                    {b.status}
                  </span>
                </td>
                <td className="p-3">
                  {b.status === "paid" ? (
                    <a
                      href={`/api/receipts/${b.id}`}
                      className="text-link hover:text-link-hover"
                      target="_blank"
                      rel="noreferrer"
                    >
                      PDF
                    </a>
                  ) : (
                    "—"
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {bookings.length === 0 && (
          <p className="p-8 text-center text-sm text-muted">Пока нет бронирований</p>
        )}
      </div>
    </div>
  );
}

function CategoryPanel({
  category,
  packages,
  showForm,
  form,
  setForm,
  editingId,
  loading,
  onAdd,
  onEdit,
  onSave,
  onCancel,
  onHide,
  onDelete,
  onToggleActive,
}: {
  category: "tours" | "hunting" | "survival";
  packages: PackageRow[];
  showForm: boolean;
  form: typeof EMPTY_FORM;
  setForm: Dispatch<SetStateAction<typeof EMPTY_FORM>>;
  editingId: string | null;
  loading: boolean;
  onAdd: () => void;
  onEdit: (p: PackageRow) => void;
  onSave: (e: FormEvent) => void;
  onCancel: () => void;
  onHide: (p: PackageRow) => void;
  onDelete: (p: PackageRow) => void;
  onToggleActive: (p: PackageRow) => void;
}) {
  const titles: Record<string, string> = {
    tours: "Обычные туры",
    hunting: "Hunting",
    survival: "Survival Challenge",
  };

  const field = (key: keyof typeof EMPTY_FORM, label: string, opts?: { rows?: number; type?: string }) => (
    <label className="block text-sm text-foreground/80">
      {label}
      {opts?.rows ? (
        <textarea
          rows={opts.rows}
          value={String(form[key] ?? "")}
          onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
          className="mt-1 w-full rounded-lg border border-black/[0.1] bg-white px-3 py-2 text-foreground"
        />
      ) : (
        <input
          type={opts?.type || "text"}
          value={typeof form[key] === "boolean" ? "" : String(form[key] ?? "")}
          onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
          className="mt-1 w-full rounded-lg border border-black/[0.1] bg-white px-3 py-2 text-foreground"
        />
      )}
    </label>
  );

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-link">{category}</p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-foreground">
            {titles[category]}
          </h1>
          <p className="mt-1 text-sm text-muted">{packages.length} пакет(ов) в этой категории</p>
        </div>
        {!showForm && (
          <button
            type="button"
            onClick={onAdd}
            className="rounded-full bg-foreground px-5 py-2.5 text-sm font-semibold text-white"
          >
            + Добавить
          </button>
        )}
      </div>

      {showForm && (
        <form
          onSubmit={onSave}
          className="mt-6 space-y-4 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/[0.04]"
        >
          <h2 className="text-lg font-semibold text-foreground">
            {editingId ? "Редактировать пакет" : "Новый пакет"} — {category}
          </h2>

          <div className="grid gap-4 md:grid-cols-2">
            {field("title", "Название *")}
            {field("destination", "Направление *")}
            {field("duration", "Длительность * (например 7 days / 6 nights)")}
            {field("difficulty", "Сложность")}
            {category === "hunting" && field("species", "Вид (species)")}
            {field("priceUsd", "Цена USD *", { type: "number" })}
            {field("depositPercent", "Депозит %", { type: "number" })}
            {field("maxGuests", "Макс. гостей", { type: "number" })}
            {field("sortOrder", "Порядок (sort)", { type: "number" })}
            <div className="md:col-span-2">{field("imageUrl", "URL картинки *")}</div>
            <div className="md:col-span-2">{field("description", "Краткое описание *", { rows: 2 })}</div>
            <div className="md:col-span-2">
              {field("longDescription", "Полное описание", { rows: 4 })}
            </div>
            <div className="md:col-span-2">
              {field("highlights", "Highlights (каждый с новой строки)", { rows: 3 })}
            </div>
            <div>
              {field("included", "Included (по строкам)", { rows: 3 })}
            </div>
            <div>
              {field("excluded", "Excluded (по строкам)", { rows: 3 })}
            </div>
          </div>

          <div className="flex flex-wrap gap-6 text-sm">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={form.active}
                onChange={(e) => setForm((f) => ({ ...f, active: e.target.checked }))}
              />
              Активен (виден на сайте)
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(e) => setForm((f) => ({ ...f, featured: e.target.checked }))}
              />
              Featured (главная)
            </label>
          </div>

          <div className="flex flex-wrap gap-3 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="rounded-full bg-foreground px-6 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
            >
              {loading ? "Сохранение…" : editingId ? "Сохранить" : "Создать"}
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="rounded-full bg-surface px-6 py-2.5 text-sm font-medium text-foreground ring-1 ring-black/[0.06]"
            >
              Отмена
            </button>
          </div>
        </form>
      )}

      <div className="mt-6 grid gap-4">
        {packages.map((pkg) => (
          <article
            key={pkg.id}
            className="flex flex-col gap-4 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-black/[0.04] sm:flex-row sm:items-center"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={pkg.imageUrl}
              alt=""
              className="h-24 w-full shrink-0 rounded-xl object-cover sm:h-20 sm:w-28"
            />
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-semibold text-foreground">{pkg.title}</h3>
                {!pkg.active && (
                  <span className="rounded-full bg-stone-100 px-2 py-0.5 text-[10px] font-semibold uppercase text-stone-500">
                    hidden
                  </span>
                )}
                {pkg.featured && (
                  <span className="rounded-full bg-sky-50 px-2 py-0.5 text-[10px] font-semibold uppercase text-sky-700">
                    featured
                  </span>
                )}
              </div>
              <p className="mt-0.5 text-xs text-muted">
                {pkg.destination} · {pkg.duration} · {formatCurrency(pkg.priceUsd)} · bookings:{" "}
                {pkg._count?.bookings ?? 0}
              </p>
              <p className="mt-1 line-clamp-1 text-sm text-muted">{pkg.description}</p>
            </div>
            <div className="flex shrink-0 flex-wrap gap-2">
              <button
                type="button"
                onClick={() => onEdit(pkg)}
                className="rounded-full bg-surface px-3 py-1.5 text-xs font-medium ring-1 ring-black/[0.06]"
              >
                Edit
              </button>
              <button
                type="button"
                onClick={() => onToggleActive(pkg)}
                className="rounded-full bg-surface px-3 py-1.5 text-xs font-medium ring-1 ring-black/[0.06]"
              >
                {pkg.active ? "Hide" : "Show"}
              </button>
              <button
                type="button"
                onClick={() => onHide(pkg)}
                className="rounded-full bg-amber-50 px-3 py-1.5 text-xs font-medium text-amber-800 ring-1 ring-amber-200"
              >
                Скрыть
              </button>
              <button
                type="button"
                onClick={() => onDelete(pkg)}
                className="rounded-full bg-red-50 px-3 py-1.5 text-xs font-medium text-red-700 ring-1 ring-red-200"
              >
                Удалить
              </button>
            </div>
          </article>
        ))}
        {packages.length === 0 && !showForm && (
          <div className="rounded-2xl bg-white px-6 py-12 text-center text-sm text-muted ring-1 ring-black/[0.04]">
            В этой категории пока нет пакетов. Нажми «+ Добавить».
          </div>
        )}
      </div>
    </div>
  );
}
