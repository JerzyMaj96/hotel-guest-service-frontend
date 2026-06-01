import type { Issue, IssueStatus } from "../types/domain";
import { statusLabel, typeLabel } from "../utils/labels";
export function StatusBadge({ status }: { status: IssueStatus }) {
  return (
    <span className={`badge ${status.toLowerCase()}`}>
      {statusLabel[status]}
    </span>
  );
}
export function IssueTable({
  issues,
  onSelect,
}: {
  issues: Issue[];
  onSelect: (i: Issue) => void;
}) {
  return (
    <table>
      <thead>
        <tr>
          <th>Numer</th>
          <th>Typ</th>
          <th>Status</th>
          <th>Data</th>
        </tr>
      </thead>
      <tbody>
        {issues.map((i) => (
          <tr key={i.id} onClick={() => onSelect(i)}>
            <td>{i.id}</td>
            <td>{typeLabel[i.type]}</td>
            <td>
              <StatusBadge status={i.status} />
            </td>
            <td>{new Date(i.creationDate).toLocaleDateString("pl-PL")}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
