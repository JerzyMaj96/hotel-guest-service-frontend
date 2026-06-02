import { useEffect, useState } from "react";
import type { Issue } from "../types/domain";
import { api } from "../api/client";
import { preferredLabel, typeLabel } from "../utils/labels";
import { StatusBadge } from "./IssueTable";

export function IssueDetails({
  issue,
  staff,
  onBack,
  onStatusChange,
}: {
  issue: Issue;
  staff?: boolean;
  onBack: () => void;
  onStatusChange: (issue: Issue) => void;
}) {
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);

  useEffect(() => {
    if (issue.photoUrl) {
      api.getPhoto(issue.photoUrl).then((blob) => {
        setPhotoUrl(URL.createObjectURL(blob));
      });
    }
    return () => {
      if (photoUrl) URL.revokeObjectURL(photoUrl);
    };
  }, [issue.photoUrl]);

  const setStatus = async (status: Issue["status"]) => {
    await api.updateStatus(issue.id, status);
    onStatusChange({ ...issue, status });
  };
  return (
    <section className="panel">
      <div className="detail-head">
        <h1>Zgłoszenie nr {issue.id}</h1>
        <p>
          Zgłoszenie zostało przyjęte <StatusBadge status={issue.status} />
        </p>
      </div>
      <p className="muted">
        Twoje zgłoszenie zostało przyjęte i przekazane do odpowiedniego działu.
        Wkrótce rozpoczniemy jego realizację.
      </p>
      <h3>Typ zgłoszenia</h3>
      <p>{typeLabel[issue.type]}</p>
      <h3>Dane zgłoszenia</h3>
      <p>
        Pokój nr {issue.roomNumber}: {issue.title}
      </p>
      <h3>Opis problemu</h3>
      <p>
        {issue.description ??
          "Szczegóły dostępne w backendzie po rozszerzeniu DTO odpowiedzi."}
      </p>
      <h3>Zdjęcie (opcjonalnie)</h3>
      <div className="attachment">
        {photoUrl ? (
          <img
            src={photoUrl}
            alt="zdjęcie zgłoszenia"
            style={{ maxWidth: "100%" }}
          />
        ) : (
          "Brak załącznika"
        )}
      </div>
      <h3>Preferowany czas realizacji</h3>
      <p>
        {issue.preferredTimeOption
          ? preferredLabel[issue.preferredTimeOption]
          : "Nie podano"}
      </p>
      <div className="actions">
        {staff && issue.status === "NEW" && (
          <button className="purple" onClick={() => setStatus("OPEN")}>
            Rozpocznij realizację
          </button>
        )}
        {staff && issue.status === "OPEN" && (
          <button className="green" onClick={() => setStatus("CLOSED")}>
            Oznacz jako zrealizowane
          </button>
        )}
        <button className="secondary" onClick={onBack}>
          Zamknij
        </button>
      </div>
    </section>
  );
}
