import type { ReactNode } from "react";
import { Hotel, LogOut, UserRound } from "lucide-react";
import { NotificationCenter } from "./NotificationCenter";
import type { Notification, AppRole } from "../types/domain";

export function Layout({
  children,
  technical,
  role,
  setRole,
  onLogout,
  notifications,
  onMarkAllRead,
}: {
  children: ReactNode;
  technical?: boolean;
  role: AppRole;
  setRole: (r: AppRole) => void;
  onLogout: () => void;
  notifications: Notification[];
  onMarkAllRead: () => void;
}) {
  return (
    <div className="app">
      <header className={technical ? "hero tech" : "hero"}>
        <div>
          <Hotel />
          <p>ROSEWOOD</p>
          <span>MIRAMAR BEACH</span>
        </div>
      </header>
      <nav className="topbar">
        <strong>
          {role === "GUEST"
            ? "Witaj, Jan!"
            : role === "TECHNICIAN"
              ? "Panel techniczny"
              : role === "RECEPTIONIST"
                ? "Panel recepcji"
                : "Panel managera"}
        </strong>
        <div>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as AppRole)}
          >
            <option value="GUEST">Gość</option>
            <option value="TECHNICIAN">Technik</option>
            <option value="RECEPTIONIST">Recepcja</option>
            <option value="MANAGER">Manager</option>
          </select>
          <NotificationCenter
            notifications={notifications}
            onMarkAllRead={onMarkAllRead}
          />
          <button className="icon-btn" onClick={onLogout}>
            <UserRound size={18} />
            <LogOut size={16} />
          </button>
        </div>
      </nav>
      <main>{children}</main>
      <footer>
        © 2026 Rosewood Miramar Beach <span>miramar.rosewood@h.com</span>
        <span>contact.miramar@rosewoodh.com</span>
        <span>+1 432 523 876</span>
      </footer>
    </div>
  );
}
