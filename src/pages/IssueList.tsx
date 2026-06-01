import { useMemo, useState } from "react";
import { Plus, Search } from "lucide-react";
import { IssueTable } from "../features/IssueTable";
import type { Issue } from "../types/domain";

export const IssueList = ({
  issues,
  role,
  onSelect,
  onNew,
}: {
  issues: Issue[];
  role: string;
  onSelect: (i: Issue) => void;
  onNew: () => void;
}) => {
  const [query, setQuery] = useState("");
  const filtered = useMemo(
    () =>
      issues.filter((i) =>
        `${i.id} ${i.title} ${i.roomNumber}`
          .toLowerCase()
          .includes(query.toLowerCase()),
      ),
    [issues, query],
  );

  return (
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
          <button onClick={onNew}>
            <Plus size={16} /> zgłoś problem
          </button>
        )}
      </div>
      {filtered.length ? (
        <IssueTable issues={filtered} onSelect={onSelect} />
      ) : (
        <div className="empty">
          <h2>Przykro nam, że napotkałeś problem podczas pobytu...</h2>
          <p>
            Nie masz jeszcze żadnych zgłoszeń. Gdy dodasz pierwsze, pojawi się w
            tym miejscu wraz z aktualnym statusem.
          </p>
        </div>
      )}
    </section>
  );
};
