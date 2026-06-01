import { FormEvent, useState } from "react";
import { Upload } from "lucide-react";
import type {
  Issue,
  IssueCreateRequest,
  PreferredTimeOption,
} from "../types/domain";
import { api } from "../api/client";

export function IssueForm({
  onCreated,
  onCancel,
}: {
  onCreated: (issue: Issue) => void;
  onCancel: () => void;
}) {
  const [option, setOption] = useState<PreferredTimeOption>(
    "AS_SOON_AS_POSSIBLE",
  );
  const [photo, setPhoto] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const f = new FormData(e.currentTarget);
    const issue: IssueCreateRequest = {
      type: String(f.get("type")) as IssueCreateRequest["type"],
      roomNumber: Number(f.get("roomNumber")),
      title: String(f.get("title")),
      description: String(f.get("description")),
      preferredTimeOption: option,
      preferredDate: String(f.get("preferredDate") || "") || undefined,
      preferredTime: String(f.get("preferredTime") || "") || undefined,
    };
    try {
      onCreated(await api.createIssue(issue, photo));
    } finally {
      setLoading(false);
    }
  }
  return (
    <section className="panel">
      <h1>Zgłoś problem</h1>
      <p className="muted">
        Opisz problem i wybierz dział, do którego powinno trafić zgłoszenie.
      </p>
      <form className="issue-form" onSubmit={submit}>
        <label>
          Wybierz typ zgłoszenia
          <select name="type" required>
            <option value="TECHNICAL">Problem techniczny</option>
            <option value="RECEPTION">Prośba do recepcji</option>
          </select>
        </label>
        <h3>Dane zgłoszenia</h3>
        <input
          name="roomNumber"
          type="number"
          min={1}
          placeholder="Numer pokoju"
          required
        />
        <input name="title" placeholder="Temat zgłoszenia" required />
        <textarea
          name="description"
          placeholder="Opis problemu"
          required
          rows={4}
        />
        <h3>Zdjęcie (opcjonalnie)</h3>
        <label className="dropzone">
          <Upload />
          <span>
            {photo
              ? photo.name
              : "Zdjęcie pomoże nam szybciej zrozumieć problem"}
          </span>
          <input
            type="file"
            accept="image/*"
            hidden
            onChange={(e) => setPhoto(e.target.files?.[0] ?? null)}
          />
        </label>
        <h3>Preferowany czas realizacji</h3>
        <label className="radio">
          <input
            type="radio"
            checked={option === "AS_SOON_AS_POSSIBLE"}
            onChange={() => setOption("AS_SOON_AS_POSSIBLE")}
          />
          Jak najszybciej
        </label>
        <label className="radio">
          <input
            type="radio"
            checked={option === "WHEN_NOT_IN_ROOM"}
            onChange={() => setOption("WHEN_NOT_IN_ROOM")}
          />
          Gdy nie będzie mnie w pokoju
        </label>
        {option === "WHEN_NOT_IN_ROOM" && (
          <div className="grid2">
            <input name="preferredDate" type="date" />
            <input name="preferredTime" type="time" />
          </div>
        )}
        <label className="radio">
          <input
            type="radio"
            checked={option === "NO_URGENCY"}
            onChange={() => setOption("NO_URGENCY")}
          />
          Tylko zgłoszenie informacyjne
        </label>
        <div className="actions">
          <button disabled={loading}>
            {loading ? "Zapisywanie..." : "Zapisz"}
          </button>
          <button type="button" className="secondary" onClick={onCancel}>
            Anuluj zmiany
          </button>
        </div>
      </form>
    </section>
  );
}
