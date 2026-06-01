import { FormEvent, useState } from "react";
import { Hotel } from "lucide-react";

export function Auth({
  onLogin,
}: {
  onLogin: (
    email: string,
    password: string,
    register?: { firstName: string; lastName: string },
  ) => Promise<void>;
}) {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const f = new FormData(e.currentTarget);
    try {
      await onLogin(
        String(f.get("email")),
        String(f.get("password")),
        mode === "register"
          ? {
              firstName: String(f.get("firstName")),
              lastName: String(f.get("lastName")),
            }
          : undefined,
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Nie udało się zalogować");
    } finally {
      setLoading(false);
    }
  }
  return (
    <div className="auth">
      <form onSubmit={submit} className="auth-card">
        <Hotel size={42} />
        <h1>Rosewood Service Desk</h1>
        <p>System obsługi zgłoszeń hotelowych</p>
        {mode === "register" && (
          <div className="grid2">
            <input name="firstName" placeholder="Imię" required />
            <input name="lastName" placeholder="Nazwisko" required />
          </div>
        )}
        <input name="email" type="email" placeholder="Adres e-mail" required />
        <input
          name="password"
          type="password"
          placeholder="Hasło"
          minLength={8}
          required
        />
        {error && <p className="error">{error}</p>}
        <button disabled={loading}>
          {loading
            ? "Proszę czekać..."
            : mode === "login"
              ? "Zaloguj"
              : "Zarejestruj"}
        </button>
        <button
          type="button"
          className="link"
          onClick={() => setMode(mode === "login" ? "register" : "login")}
        >
          {mode === "login" ? "Utwórz konto" : "Mam już konto"}
        </button>
      </form>
    </div>
  );
}
