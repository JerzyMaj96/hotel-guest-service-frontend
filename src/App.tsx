import { useMemo, useState } from "react";
import { Plus, Search } from "lucide-react";
import { Auth } from "./features/Auth";
import { IssueForm } from "./features/IssueForm";
import { IssueDetails } from "./features/IssueDetails";
import { IssueTable } from "./features/IssueTable";
import { Layout } from "./components/Layout";
import { useAuth } from "./hooks/useAuth";
import { useIssues } from "./hooks/useIssues";
import { useNotifications } from "./hooks/useNotifications";
import type { Issue } from "./types/domain";
import "./styles.css";

export default function App() {
  const { isAuthed, role, onLogin, onLogout } = useAuth();
  const [view, setView] = useState<"list" | "form" | "details">("list");
  const [selected, setSelected] = useState<Issue | null>(null);
  const [query, setQuery] = useState("");
  const { notifications, notify, markAllRead } = useNotifications();
  const {
    issues,
    onCreated: issueCreated,
    onStatusChange: issueStatusChanged,
  } = useIssues(isAuthed, role);

  const filtered = useMemo(
    () =>
      issues.filter((i) =>
        `${i.id} ${i.title} ${i.roomNumber}`
          .toLowerCase()
          .includes(query.toLowerCase()),
      ),
    [issues, query],
  );

  async function handleLogin(
    email: string,
    password: string,
    register?: { firstName: string; lastName: string },
  ) {
    await onLogin(email, password, register);
    notify({
      type: "success",
      title: "Zalogowano",
      message: "Sesja użytkownika została rozpoczęta.",
    });
  }

  function onCreated(issue: Issue) {
    issueCreated(issue);
    setSelected(issue);
    setView("details");
    notify({
      type: "success",
      title: "Zgłoszenie zostało wysłane",
      message: `Twoje zgłoszenie nr ${issue.id} zostało zapisane.`,
      issueId: issue.id,
    });
  }

  function onStatusChange(issue: Issue) {
    issueStatusChanged(issue);
    setSelected(issue);
    notify({
      type: issue.status === "CLOSED" ? "success" : "info",
      title: "Status zgłoszenia został zmieniony",
      message: `Zgłoszenie nr ${issue.id}: ${issue.status}.`,
      issueId: issue.id,
    });
  }

  if (!isAuthed) return <Auth onLogin={handleLogin} />;
  const staff = role !== "GUEST";

  return (
    <Layout
      role={role}
      setRole={role}
      technical={staff}
      onLogout={onLogout}
      notifications={notifications}
      onMarkAllRead={markAllRead}
    >
      {view === "form" && (
        <IssueForm onCreated={onCreated} onCancel={() => setView("list")} />
      )}{" "}
      {view === "details" && selected && (
        <IssueDetails
          issue={selected}
          staff={staff}
          onBack={() => setView("list")}
          onStatusChange={onStatusChange}
        />
      )}{" "}
      {view === "list" && (
        <section className="panel">
          <div className="toolbar">
            <label>
              <Search size={16} />
              <input
                placeholder="Szukaj"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </label>
            {role === "GUEST" && (
              <button onClick={() => setView("form")}>
                <Plus size={16} /> zgłoś problem
              </button>
            )}
          </div>
          {filtered.length ? (
            <IssueTable
              issues={filtered}
              onSelect={(i) => {
                setSelected(i);
                setView("details");
              }}
            />
          ) : (
            <div className="empty">
              <h2>Przykro nam, że napotkałeś problem podczas pobytu...</h2>
              <p>
                Nie masz jeszcze żadnych zgłoszeń. Gdy dodasz pierwsze, pojawi
                się w tym miejscu wraz z aktualnym statusem.
              </p>
            </div>
          )}
        </section>
      )}
    </Layout>
  );
}
